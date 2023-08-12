const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model defined as well
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  public_id: {
    type: String, // Add the public_id field to store the Cloudinary public_id
    required: true,
  },
  tags: {
    type: [String],
    default: [], // You can provide default tags if needed
  },
  comments: [
    {
      commentId: {
        type: mongoose.Schema.Types.ObjectId,
        auto: true, // Automatically create a new ObjectId for each comment
      },
      text: {
        type: String,
        required: true,
      },
    },
  ],
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}, // You can provide default metadata if needed
  },
  // You can add more fields as needed (e.g., timestamps, etc.)
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
