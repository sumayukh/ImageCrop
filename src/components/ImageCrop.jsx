import React, { useState } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrop = () => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({ aspect: 16 / 9 });
  const [image, setImage] = useState(null);
  const [output, setOutput] = useState(null);

  // const handleChange = (e) => {
  //   setSrc(URL.createObjectURL(e));
  // };
  const cropImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const resolution = window.devicePixelRatio;
    const imageElement = new Image();

    imageElement.onload = () => {
      canvas.width = crop.width * resolution;
      canvas.height = crop.height * resolution;
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(imageElement, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

      const newImg = canvas.toDataURL("image/jpeg");
      setOutput(newImg);
    };

    imageElement.src = src;
  };

  console.log("src", src);

  return (
    <center>
      <input
        type="file"
        accept="image"
        onChange={(e) => {
          const file = e.target.files[0];
          setSrc(URL.createObjectURL(file));
          console.log("e==>", file);
        }}
      />{" "}
      <br />
      <div>
        {src && (
          <div>
            <ReactCrop src={src} onImageLoaded={setImage} crop={crop} onChange={setCrop} />
            <hr />
            <button
              onClick={() => {
                cropImage();
              }}
            >
              cropImage Crop Image
            </button>
          </div>
        )}
      </div>
      <div>{output && <img src={output} alt="croppedImage" />}</div>
    </center>
  );
};

export default ImageCrop;
