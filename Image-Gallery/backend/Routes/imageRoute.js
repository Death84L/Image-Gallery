const express = require('express');
const router = express.Router();
const { uploadImage ,fetchUserImages ,deleteImage,deleteComment, saveComment, getImageDetails} = require('../Controllers/imageController');
const multer = require('multer');
//, getUserImages, deleteImage
// Middleware to handle image upload using Multer (you need to install multer library)
// Middleware to handle image upload using Multer
const storage = multer.diskStorage({
   
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  const upload = multer({
    storage: storage,
    
  });


  
// Routes
 router.post('/upload', upload.single('image'), uploadImage);
 router.get('/:username/all', fetchUserImages);
 router.delete('/:imageId', deleteImage);
 router.get('/detail/:imageId', getImageDetails);
 router.post('/:imageId/comments', saveComment);
 router.delete('/:imageId/comments/:commentId', deleteComment);
 
 
// router.get('/', getUserImages);
// router.delete('/:imageId', deleteImage);

module.exports = router;
