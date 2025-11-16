// utils/uploadImage.js
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export const uploadImage = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const fileRef = ref(storage, `posts/${Date.now()}.jpg`);
  await uploadBytes(fileRef, blob);
  return await getDownloadURL(fileRef);
};
