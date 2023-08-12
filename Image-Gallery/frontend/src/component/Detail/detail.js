import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DetailImage = () => {
  const { imageId } = useParams();
  const [imageData, setImageData] = useState(null);
  const [comment, setComment] = useState('');
  useEffect(() => {
    fetchImageDetails();
  });

  const navigate = useNavigate();

  const fetchImageDetails = async () => {
    try {
      // Make a GET request to fetch the details of the image with the given imageId
      const response = await fetch(`http://localhost:5000/api/images/detail/${imageId}`);
      if (response.ok) {
        const imageDetails = await response.json();
        setImageData(imageDetails);
      } else {
        console.error('Error fetching image details:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching image details:', error.message);
    }
  };

  const fetchGoogleCloudVisionData = async () => {
    // try {
    //   // Make a GET request to fetch tags from the AI API for the current image
    //   const response = await fetch(`http://localhost:5000/api/images/${imageId}/tags`);
    //   if (response.ok) {
    //     const tagsData = await response.json();
    //     // Assuming the API response returns the tags in an array called "tags"
    //     if (tagsData && tagsData.tags && tagsData.tags.length > 0) {
    //       // Update the tags field in the image data
    //       setImageData({ ...imageData, tags: tagsData.tags });
    //     }
    //   } else {
    //     console.error('Error fetching tags from AI API:', response.statusText);
    //   }
    // } catch (error) {
    //   console.error('Error fetching tags from AI API:', error.message);
    // }
  };

  const handleSaveComment = async () => {
    try {
      // Make a POST request to save the comment for the current image
      const response = await fetch(`http://localhost:5000/api/images/${imageId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: comment }), // In the model, the comment text is stored as "text"
      });
      console.log(response)
      if (response.ok) {
        // Update the comments field in the image data
        const commentData = await response.json();
       // const commentData = await response.json();
        setImageData({ ...imageData, comments: [...imageData.comments, commentData] });

        // Clear the comment input field
        setComment('');
        fetchImageDetails();
      } else {
        console.error('Error saving comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error saving comment:', error.message);
    }
  };
  
  const handleDeleteComment = async (commentId) => {
    try {
      // Make a DELETE request to delete the comment with the given commentId
      const response = await fetch(`http://localhost:5000/api/images/${imageId}/comments/${commentId}`, {
        method: 'DELETE',
      });
      console.log(response)
      if (response.ok) {
        // Filter out the deleted comment from the image data
        const updatedComments = imageData.comments.filter((comment) => comment.commentId !== commentId);
        setImageData({ ...imageData, comments: updatedComments });
        fetchImageDetails();
      } else {
        console.error('Error deleting comment:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };
  
  

  // const handleEditButtonClick = () => {
  //   // Navigate to the edit page for the current image
  //   navigate(`/detail/${imageId}/edit`);
    
  // };
  const handleEditButtonClick = () => {
    // Navigate to the edit page for the current image
    fetchImageDetails();

  // Then navigate to the edit page for the current image
  
  navigate(`/detail/${imageId}/edit`, { state: { imageUrl: imageData?.url || '' } });
  };

  const handleOptimizeButtonClick = () => {
    // Navigate to the optimize page for the current image
   // history.push(`/optimize/${imageData._id}`);
  };

  const handleDownloadButtonClick = async () => {
    try {
      // Fetch the image data
      const response = await fetch(imageData.url);
      if (!response.ok) {
        throw new Error('Failed to fetch image data');
      }
  
      // Convert the image data to a Blob
      const blob = await response.blob();
  
      // Create a URL for the Blob
      const imageUrl = URL.createObjectURL(blob);
  
      // Create a virtual anchor element to trigger the download
      const downloadLink = document.createElement('a');
      downloadLink.href = imageUrl;
      downloadLink.download = `${imageData.title}.${imageData.metadata.format}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  
      // Revoke the URL to free up memory
      URL.revokeObjectURL(imageUrl);
    } catch (error) {
      console.error('Error downloading image:', error.message);
    }
  };
  



  return (
    <div>
  {imageData && (
    <div className="image-details">
      <img src={imageData.url} alt={imageData.title} />
      <h1>{imageData.title}</h1>
      <div>Tags: {imageData.tags.join(', ')}</div>
      <div>
        Comments:
        {imageData.comments.map((comment) => (
          <div key={comment._id} style={{ border: '1px solid blue', padding: '5px', margin: '5px' }}>
            {comment.text}
            <span
              style={{ marginLeft: '10px', cursor: 'pointer' }}
              onClick={() => handleDeleteComment(comment._id)}
            >
              ❌
            </span>
          </div>
        ))}
      </div>
      <div>Metadata:</div>
      {Object.entries(imageData.metadata).map(([key, value]) => (
        <div key={key}>
          {key === 'createdAtDate' ? (
            <div>
              <strong>Created Date:</strong> {new Date(value).toLocaleDateString()}
            </div>
          ) : key === 'createdAtTime' ? (
            <div>
              <strong>Created Time:</strong> {value}
            </div>
          ) : (
            <div>
              <strong>{key}:</strong> {value}
            </div>
          )}
        </div>
      ))}
      <button onClick={handleEditButtonClick}>Edit</button>
      <button onClick={handleOptimizeButtonClick}>Optimize</button>
      <button onClick={fetchGoogleCloudVisionData}>Tag</button>
      <button onClick={handleDownloadButtonClick}>Download</button>
      <button onClick={() => navigate(-1)}>Go Back</button>
      {/* <button onClick={fetchFileInformation}>File Info</button> */}
      {/* Add other buttons as needed */}
    </div>
  )}

  {/* For Comment Button: */}
  <textarea placeholder="Enter your comment" value={comment} onChange={(e) => setComment(e.target.value)} />
  <button onClick={handleSaveComment}>Save Comment</button>

 
</div>
  );
};

export default DetailImage;
