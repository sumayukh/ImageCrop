// import React, { useState, useRef } from "react";

// const ImageCrop = () => {
//   const inputRef = useRef();
//   const [image, setImage] = useState(null);

//   const handleChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);
//     const reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onloadend = () => {
//       const img = new Image();
//       img.src = reader.result;
//       img.onLoad = () => {
//         const canvas = document.createElement("canvas");
//         const maxSize = Math.max(img.width, img.height);
//         canvas.width = maxSize;
//         canvas.height = maxSize;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(
//           img,
//           (maxSize - img.width) / 2,
//           (maxSize - img.height) / 2
//         );
//         canvas.toBlob(
//           (blob) => {
//             const file = new File([blob], imgname, {
//               type: "image/*",
//               lastModified: Date.now(),
//             });
//             console.log("file", file);
//             setImage(file);
//           },
//           "image/*",
//           0.8
//         );
//       };
//     };
//   };

//   return (
//     <div>
//       <div
//         onClick={() => {
//           inputRef.current.click();
//         }}
//         style={{ cursor: "pointer" }}
//       >
//         <p>
//           <span>
//             <label>{image ? image.name : "Choose an image"}</label>
//           </span>
//           {image && <img src={URL.createObjectURL(image)} alt="No image" />}
//         </p>
//         <br />

//         <input
//           //   style={{ display: "none" }}
//           ref={inputRef}
//           type="file"
//           accept="image/*"
//           onChange={handleChange}
//         />
//       </div>
//       {/* <button>Crop Image</button> */}
//     </div>
//   );
// };

// export default ImageCrop;

import React, { useState, useRef } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

const ImageCrop = () => {
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
    unit: "%",
    width: 80,
    height: 45,
    aspect: 16 / 9,
  });
  const [croppedUrl, setCroppedUrl] = useState(null);
  //   const [image, setImage] = useState(null);
  //   const [output, setOutput] = useState(null);
  const imageRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setSrc(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onImageLoaded = (img) => {
    imageRef.current = img;
  };
  const onCropComplete = (cropImg) => {
    makeClientCrop(cropImg);
  };
  const onCropChange = (cropImg) => {
    setCrop(cropImg);
  };
  const makeClientCrop = async (crop) => {
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = cropImage(imageRef.current, crop, "newFile.png");
      setCroppedUrl(croppedImageUrl);
    }
  };

  const cropImage = (img, crop, fileName) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const xScale = img.naturalWidth / img.width;
      const yScale = img.naturalHeight / img.height;
      const resolution = window.devicePixelRatio;
      canvas.width = crop.width * resolution;
      canvas.height = crop.height * resolution;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(resolution, 0, 0, resolution, 0, 0);
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        crop.x * xScale,
        crop.y * yScale,
        crop.width * xScale,
        crop.height * yScale,
        0,
        0,
        crop.width * resolution,
        crop.height * resolution
      );

      // const newImg = canvas.toDataURL("image/jpeg");
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        window.URL.revokeObjectURL(imageRef.current.src);
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/png");
      // setOutput(newImg);
    });
  };
  //   console.log("src", src);
  //   console.log("img", image);
  //   console.log("crop", crop);

  return (
    <center>
      <input
        ref={imageRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
      />{" "}
      <br />
      <img src={src} alt="No image selected" />
      <div>
        {src && (
          <div>
            <ReactCrop
              src={src}
              crop={crop}
              onImageLoaded={onImageLoaded}
              ruleOfThirds
              onChange={onCropChange}
              onComplete={onCropComplete}
            />
            <hr />
            <button
              onClick={(val) => {
                console.log("hiii", val);
                makeClientCrop(crop);
              }}
            >
              Crop Image
            </button>
            <hr />
            {croppedUrl && (
              <img src={croppedUrl} alt="Crop" style={{ width: "100%" }} />
            )}
          </div>
        )}
      </div>
    </center>
  );
};

export default ImageCrop;
