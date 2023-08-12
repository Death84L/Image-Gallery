import React, { useState, useEffect } from 'react';
import './media.css';
import { useNavigate } from 'react-router-dom'

const MediaPage = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [imageTitle, setImageTitle] = useState('');

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    const username = localStorage.getItem("username");
    formData.append('image', imageFile);
    formData.append('username', username);
    formData.append('title', imageTitle);

    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'username':username,
    };

    const options = {
      method: 'POST',
      headers,
      body: formData,
    };

    try {
      const response = await fetch('http://localhost:5000/api/images/upload', options);
      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Something went wrong');
      }

      // Handle the response data if needed
      if (responseData.message === 'Image uploaded successfully') {
        // Show a success message or perform any other action
        console.log('Image uploaded successfully');
        // Refresh the image list or perform other actions after successful upload
        showUserImages();
      } else {
        // Handle any other response scenarios as needed
        console.log('Image upload failed:', responseData.message);
      }
    } catch (error) {
      console.error('Error uploading image:', error.message);
    }
  };
  
  const showUserImages = async () => {
    try {
      const username = localStorage.getItem("username");
      const token = localStorage.getItem('token');
      // Define the options for the fetch request
      const options = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          // You might need to include any necessary authorization headers here if required by your server
        },
      };
      const response = await fetch(`http://localhost:5000/api/images/${username}/all`, options);
  
      // Check if the response status indicates success (status code 200-299)
      if (response.ok) {
        // Parse the response data as JSON
        const imagesData = await response.json();
  
        // Assuming you have a 'setImages' function (e.g., a state setter in React) to update the images state
        // Update the 'images' state with the fetched data
        setImages(imagesData);
      } else {
        // Handle any other response scenarios as needed
        console.log('Error fetching images:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching images:', error.message);
    }
  };
  

  const handleImageDelete = async (imageId, username) => {
    try {
      const jwtToken = localStorage.getItem('token'); // Get the JWT token from localStorage
      const username = localStorage.getItem("username");
      const response = await fetch(`http://localhost:5000/api/images/${imageId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${jwtToken}`, // Include the JWT token with the "Bearer" scheme
          'Content-Type': 'application/json', // Add the Content-Type header
        },
        body: JSON.stringify({ username }), // Send the username in the request body
      });
  
      // Check if the deletion was successful (status code 200-299)
      if (response.ok) {
        console.log('Image deleted successfully');
  
        // After the deletion, fetch and update the user images again
        showUserImages();
      } else {
        // Handle any other response scenarios as needed
        console.error('Error deleting image:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting image:', error.message);
    }
  };
  

  useEffect(() => {
    showUserImages();
  }, []);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const fileInput = event.target.querySelector('input[type="file"]');
   // console.log(fileInput.files[0]);
    if (fileInput.files.length > 0) {
      handleImageUpload(fileInput.files[0]);
      fileInput.value = null;
    }
  };

  const handleOpenButtonClick = (imageId) => {
    navigate(`/detail/${imageId}`)
  };

  return (
    <div>
      <h1>Media app</h1>
<form id="upload-form" onSubmit={handleFormSubmit} encType="multipart/form-data">
<input type="file" id="image-input" name="image" />
  <input
    type="text"
    placeholder="Image Title"
    value={imageTitle}
    onChange={(e) => setImageTitle(e.target.value)}
  />
  <button type="submit">Upload Image</button>
</form>

      <h2>Now Form Begins</h2>
      <div id="media-container">
        {images.map((image) => (
          <div key={image._id} className="image-card"   >
          <img src={image.url} alt={`Image_Kausstubh ${image._id}`} />
          <button
           onClick={() => handleImageDelete(image._id)
          }>Delete</button>
          <button
           onClick={() => handleOpenButtonClick (image._id)
          }>Open</button>
        </div>
        ))}
      </div>
    </div>
  );
};

export default MediaPage;
