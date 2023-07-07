import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const EasyCrop = () => {
  const [src, setSrc] = useState(null);
  const [croppedImage, setCroppedImage] = useState({
    x: 0,
    y: 0,
    unit: "%",
    width: 80,
    height: 45,
    aspect: 16 / 9,
    scale: 1,
  });

  const handleScaleChange = (e) => {
    const scale = parseFloat(e.target.value);
    setCroppedImage((prevState) => ({
      ...prevState,
      scale,
    }));
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "space-evenly",
        gap: "5rem",
      }}
    >
      {src && (
        <>
          <div>
            <AvatarEditor
              image={src}
              width={400}
              height={225}
              scale={croppedImage.scale}
              rotate={0}
              border={[1, 1]}
              borderRadius={26}
            />
            <br />
          </div>

          <div>
            <label htmlFor="zoom-slider">Zoom:</label>
            <input
              type="range"
              id="zoom-slider"
              min="0.1"
              max="2"
              step="0.1"
              value={croppedImage.scale}
              onChange={handleScaleChange}
            />
          </div>
        </>
      )}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const file = e.target.files[0];
              setSrc(URL.createObjectURL(file));
            }
          }}
        />
      </div>

      <div>
        <img src={src} alt="No image selected" />
      </div>
    </div>
  );
};

export default EasyCrop;
