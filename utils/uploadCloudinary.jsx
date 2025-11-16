export const uploadCloudinary = async (uri) => {
  const cloudName = "dbarb1i91"; // vendose këtu
  const uploadPreset = "travelAppUploads"; // vendose këtu

  const formData = new FormData();
  formData.append("file", {
    uri,
    type: "image/jpeg",
    name: "photo.jpg",
  });
  formData.append("upload_preset", uploadPreset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();
  return data.secure_url; // URL i fotos
};
