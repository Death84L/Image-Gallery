// ImageEditor.js

import React, { useRef,useState, useEffect,useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import Slider from '@material-ui/core/Slider';
import { RotateLeft, Crop, Transform, Tune, Layers, BorderAll } from '@material-ui/icons';
import './editImage.css'; // External CSS file for styling



const ImageEditor = () => {
  const location = useLocation();
  const imageRef = useRef(null);
  const imageUrl = location.state?.imageUrl || '';
  const [filteredImageUrl, setFilteredImageUrl] = useState('');
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [overlay, setOverlay] = useState(null);
  const [frameWidth, setFrameWidth] = useState(0);
  const [frameColor, setFrameColor] = useState('#000000');
  const [imageLoaded, setImageLoaded] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    if (croppedAreaPixels && croppedAreaPixels.width > 0 && croppedAreaPixels.height > 0) {
      setCrop(croppedArea);
      setCroppedAreaPixels(croppedAreaPixels); 
    }
  }, []);
  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onRotationChange = useCallback((rotation) => {
    setRotation(rotation);
  }, []);
  const applyFilter = () => {
    if (!imageLoaded) return; // Check if the image is loaded before applying filters
  
    if (!imageRef.current) return;
  
    const canvas = document.createElement('canvas');
    canvas.width = croppedAreaPixels.width; // Use the cropped area width
    canvas.height = croppedAreaPixels.height; // Use the cropped area height
    const ctx = canvas.getContext('2d');
  
    ctx.filter = `brightness(${brightness}%) blur(${blur}px) saturate(${saturation}%) contrast(${contrast}%) 
    }`;
    console.log(imageRef.current.imageRef)
  console.log(croppedAreaPixels)
    // Draw the cropped image onto the canvas
    const img = document.getElementById("ready");
    console.log(img)
    ctx.drawImage(
      img,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );
  
     // Convert the canvas to a Blob
     canvas.toBlob((blob) => {
      // Create a URL from the Blob object
      const editedImageUrl = URL.createObjectURL(blob);
      setFilteredImageUrl(editedImageUrl);
      console.log(editedImageUrl)
    }, 'image/jpeg', 1.0);
  };
  
  

  function handleOverlayChange(e) {
    // Set the selected overlay image
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOverlay(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleFrameWidthChange = (e, value) => {
    setFrameWidth(value);
  };

  const handleFrameColorChange = (e) => {
    setFrameColor(e.target.value);
  };
  const handleImageLoad = useCallback(() => {
    console.log('Image loaded!  456');
    setImageLoaded(true);
  }, []);
  const cropperRef = useRef(null); // Create a new ref for the Cropper component

  useEffect(() => {
    // Assign the cropperRef to the current Cropper component when it mounts
    cropperRef.current = imageRef.current;
  }, []);

  
  return (
    <div className="image-editor-container">
      {/* Sidebar */}
      <div className="sidebar">
        {/* Crop */}
        <div className="icon-text" onClick={() => setOverlay(null)}>
          <Crop />
          <span>Crop</span>
        </div>
        <div className="slider-container">
          {/* Crop Slider */}
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e, zoom) => setZoom(zoom)}
            aria-labelledby="zoom-slider"
          />
        </div>

        {/* Rotate */}
        <div className="icon-text" onClick={() => setOverlay(null)}>
          <RotateLeft />
          <span>Rotate</span>
        </div>
        <div className="slider-container">
          {/* Rotation Slider */}
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            onChange={(e, rotation) => setRotation(rotation)}
            aria-labelledby="rotation-slider"
          />
        </div>

        {/* Transform */}
        <div className="icon-text" onClick={() => setOverlay(null)}>
          <Transform />
          <span>Transform</span>
        </div>
        {/* Add other transformation options as needed */}

        {/* Effects */}
        <div className="icon-text" onClick={() => setOverlay(null)}>
          <Tune />
          <span>Effects</span>
        </div>
        <div className="slider-container">
          {/* Brightness Slider */}
          <Slider
            value={brightness}
            min={0}
            max={200}
            step={1}
            onChange={(e, brightness) => setBrightness(brightness)}
            aria-labelledby="brightness-slider"
          />

          {/* Contrast Slider */}
          <Slider
            value={contrast}
            min={0}
            max={200}
            step={1}
            onChange={(e, contrast) => setContrast(contrast)}
            aria-labelledby="contrast-slider"
          />

          {/* Saturation Slider */}
          <Slider
            value={saturation}
            min={0}
            max={200}
            step={1}
            onChange={(e, saturation) => setSaturation(saturation)}
            aria-labelledby="saturation-slider"
          />

          {/* Blur Slider */}
          <Slider
            value={blur}
            min={0}
            max={10}
            step={0.1}
            onChange={(e, blur) => setBlur(blur)}
            aria-labelledby="blur-slider"
          />

          {/* Apply Filters Button */}
          <button onClick={applyFilter}>Apply Filters</button>
        </div>

        {/* Overlay */}
        <div className="icon-text">
          <input type="file" accept="image/*" onChange={handleOverlayChange} />
          <Layers />
          <span>Overlay</span>
        </div>

        {/* Frames */}
        <div className="icon-text">
          <BorderAll />
          <span>Frames</span>
        </div>
        <div className="slider-container">
          {/* Frame Width Slider */}
          <Slider
            value={frameWidth}
            min={0}
            max={100}
            step={1}
            onChange={handleFrameWidthChange}
            aria-labelledby="frame-width-slider"
          />

          {/* Frame Color Picker */}
          <input type="color" value={frameColor} onChange={handleFrameColorChange} />
        </div>
      </div>

       {/* Image Container */}
      <div className="image-container">
        {/* Display the image using Cropper */}
        <div className="cropper-wrapper">
          <Cropper
            image={filteredImageUrl || imageUrl} // Replace this with your image URL
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={4 / 3}
            onCropChange={onCropChange}
            onCropComplete={onCropComplete}
            onZoomChange={onZoomChange}
            onRotationChange={onRotationChange}
            cropSize={{ width: 400, height: 300 }}
            showGrid
            ref={imageRef}
             onImageLoaded={handleImageLoad}
            
          />
          <img
              id='ready'
              src={imageUrl}
              alt="Crop preview"
              onLoad={handleImageLoad} // Call handleImageLoad when the image is loaded
              style={{ display: 'none' }} // Hide the image visually
              crossOrigin='anonymous' 
            />
        </div>
        
        {/* Apply Overlay */}
        {overlay && <img className="overlay-image" src={overlay} alt="Overlay" />}
        {/* Apply Frame */}
        <div
          className="image-frame"
          style={{
            borderWidth: `${frameWidth}px`,
            borderColor: frameColor,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ImageEditor;











