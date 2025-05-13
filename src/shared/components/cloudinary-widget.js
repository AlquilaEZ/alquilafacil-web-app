const cloudName = "ducsr2p2w"; 
const uploadPreset = "ml_default";

export const cloudinaryWidget = () =>
  new Promise((resolve, reject) => {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloud_name: cloudName,
        upload_preset: uploadPreset,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          resolve(result.info.secure_url);
        }
      }
    );
    widget.open();
  });