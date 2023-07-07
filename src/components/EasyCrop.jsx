import React, { useState } from "react";
import AvatarEditor from "react-avatar-editor";

const EasyCrop = () => {
  const [isUploaded, setIsUploaded] = useState(false);
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

  const handleSubmit = async (imageSource) => {
    const newImage = await getImageFromSource(imageSource);
    const croppedImg = cropImage(newImage);
    setSrc(croppedImg.src);
  };

  const handlePositionChange = async (position) => {
    const tempImage = croppedImage;
    tempImage.x = position.x;
    tempImage.y = position.y;
    setCroppedImage(tempImage);
  };
  const getImageFromSource = (source) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        resolve(img);
      });
      img.addEventListener("error", () => {
        reject(new Error("Failed to load the image."));
      });
      img.src = source;
      return img;
    });
  };
  const cropImage = (image) => {
    const canvas = document.createElement("canvas");
    canvas.width = croppedImage.width;
    canvas.height = croppedImage.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedImage.x,
      croppedImage.y,
      croppedImage.width,
      croppedImage.height,
      0,
      0,
      croppedImage.width,
      croppedImage.height
    );
    const newImg = new Image();
    newImg.src = canvas?.toDataURL();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    return newImg;
  };
  const handleScaleChange = (e) => {
    handlePositionChange(croppedImage);
    const scale = parseFloat(e.target.value);
    setCroppedImage((prevState) => ({
      ...prevState,
      scale,
    }));
  };

  console.log("src", src);
  return (
    <>
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
                disableBoundaryChecks={true}
                image={src}
                width={400}
                height={225}
                scale={croppedImage.scale}
                onPositionChange={handlePositionChange}
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
                min="0.01"
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
              isUploaded && setIsUploaded(false);
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
      <div>
        <button
          disabled={src && !isUploaded ? false : true}
          type="submit"
          onClick={() => {
            handleSubmit(src);
            src && setSrc(null);
            setIsUploaded(true);
          }}
        >
          Upload
        </button>
      </div>
    </>
  );
};

export default EasyCrop;
