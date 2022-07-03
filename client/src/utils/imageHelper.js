export const uploadImage = async (file) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('upload_preset', process.env.REACT_APP_UPLOAD_PRESET);
  formData.append('cloud_name', process.env.REACT_APP_CLOUD_NAME);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );
  const data = await res.json();

  return {
    secure_url: data.secure_url,
    public_id: data.public_id,
  };
};
