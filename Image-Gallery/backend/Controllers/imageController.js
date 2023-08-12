const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const multer = require('multer');
const Image = require('../Model/imageModel'); 
const User  = require('../Model/userModel'); 
const mongoose = require('mongoose');
const axios =require('axios');

const verifyToken = (token) => {
  try {
    // Replace 'your_secret_key' with your actual JWT secret key used for signing the token
    const decodedToken = jwt.verify(token, 'secret123');
    return decodedToken; // Return the decoded token payload (user information)
  } catch (error) {
    return null; // Return null if the token is invalid
  }
};

          
cloudinary.config({ 
  cloud_name: 'deqoinlni', 
  api_key: '572361659566336', 
  api_secret: 'jZlCakSdRdS01TIG8EfNhsqfwko' 
});

const uploadImage = async (req, res) => {
  try {
    // Check if the request contains a valid user token
    const jwtToken = req.headers.authorization;
    const name=req.headers.username;

    const token = jwtToken.split(' ')[1];
    //console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Verify the token here (you need to implement token verification logic)
    const isValidToken = verifyToken(token);
    
    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    const user = isValidToken;
   // console.log(user)
    // Check if the request contains an image file
    const file=req.file;
  
    if (!file) {
      return res.status(400).json({ message: 'No image file provided' });
    }
    
    // Upload the image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(file.path);
    // Get the current date and time
    const currentDate = new Date();
    const createdAtDate = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD format
    const currentIndianTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    const imageSizeInBytes = cloudinaryResponse.bytes;
    const imageFormat = cloudinaryResponse.format;
    const imageSizeInKB = (imageSizeInBytes / 1024).toFixed(2);   // Convert bytes to kilobytes
    
    // Save the image data to the database
    const newImage = new Image({
      user: user._id, // Assuming the unique username is sent in the request body
      url: cloudinaryResponse.secure_url, // Save the public URL from cloudinary response
      title: req.body.title, // Assuming the image title is sent in the request body
      public_id: cloudinaryResponse.public_id, 
      metadata: {
        author: name,
        createdAtDate: createdAtDate, // Add creation date to metadata
        createdAtTime: currentIndianTime, // Add creation time to metadata
        "Size(KB)": imageSizeInKB,
        format: imageFormat,
        // Add more metadata fields as needed
      },
    });

    await newImage.save();

    // Optionally, you can delete the temporary image file after upload if needed
    // fs.unlinkSync(req.file.path); // Make sure to import the fs module

    res.status(201).json({ message: 'Image uploaded successfully' });
  } catch (error) {
    console.error('Error uploading image:', error.message);
    res.status(500).json({ message: 'Image upload failed' });
  }
};


const fetchUserImages = async (req, res) => {
  try {
    const username = req.params.username;
    const jwtToken = req.headers.authorization;
    const token = jwtToken.split(' ')[1];
    //console.log(token)
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized access' });
    }

    // Verify the token here (you need to implement token verification logic)
    const isValidToken = verifyToken(token);
    
    if (!isValidToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    
    // Fetch the user from the database based on the username
    // Assuming you have a User model with 'username' field
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch all images belonging to the specified user from the database
    const images = await Image.find({ user: user._id });

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//delete a particular image 
const deleteImageFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
    console.log('Image deleted from Cloudinary');
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error.message);
    throw error;
  }
};

// Controller function to delete an image by imageId
const deleteImage = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const username = req.body.username; // Get the username from the request body

    // Fetch the user from the database based on the username
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
// console.log(imageId)
// console.log(user._id)
    // Check if the user owns the image (You might have a different way to verify ownership)
    const image = await Image.findOne({ _id: imageId, user: user._id });
    if (!image) {
      return res.status(404).json({ message: 'Image not found or you are not authorized to delete it' });
    }

    // Delete the image from Cloudinary first
    await deleteImageFromCloudinary(image.public_id);

    // Then delete the image from MongoDB
    await Image.deleteOne({ _id: imageId });

    res.status(200).json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Error deleting image:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//get particulare image detail
// Assuming you already have the Image model defined and imported

const getImageDetails = async (req, res) => {
  try {
    const imageId = req.params.imageId;

    // Fetch the image from the database based on the imageId
    const image = await Image.findById(imageId);

    // Check if the image exists
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Return the image details to the frontend
    res.json(image);
  } catch (error) {
    console.error('Error fetching image details:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const saveComment = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const { text } = req.body;

    // Find the image by its ID
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }

    // Create a new ObjectId for the commentId field
    const commentId = new mongoose.Types.ObjectId();

    // Add the comment to the image's comments array
    const comment = {
      commentId: commentId,
      text: text,
    };

    image.comments.push(comment);

    // Save the updated image document to the database
   
    await image.save();

    // Respond with a success message and the saved comment
    res.status(200).json({ message: 'Comment saved successfully', comment: comment });
  } catch (error) {
    console.error('Error saving comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete comment for a specific image
const deleteComment = async (req, res) => {
  try {
    const imageId = req.params.imageId;
    const commentId = req.params.commentId;

    // Find the image by its ID
    const image = await Image.findById(imageId);
    if (!image) {
      return res.status(404).json({ message: 'Image not found' });
    }
   // console.log(image)
    // Find the index of the comment with the given commentId
    // Convert the commentId from string to ObjectId
    const commentObjectId = new mongoose.Types.ObjectId(commentId);
   // console.log(commentObjectId)
    // Find the index of the comment with the given commentId
    const commentIndex = image.comments.findIndex((comment) => comment._id.equals(commentObjectId));
    //console.log(commentIndex)
    if (commentIndex === -1) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Remove the comment from the image's comments array
    image.comments.splice(commentIndex, 1);

    // Save the updated image document to the database
    await image.save();

    // Respond with a success message
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {
    uploadImage,
    fetchUserImages,
    deleteImage,
    getImageDetails,
    saveComment,
    deleteComment,
    
  };