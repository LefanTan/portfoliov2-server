import { ProfileData } from "../types/profile.type";
import axiosInstance from "./axiosInstance";

export const updateOrCreateProfile = (userId: number, profile: ProfileData) => {
  let formData = new FormData();
  Object.entries(profile).forEach(([key, value]) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach((entry, index) => {
        formData.append(key, entry);
      });
    } else {
      formData.append(key, value);
    }
  });

  console.log(profile);

  return axiosInstance.put("/profile/" + userId, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfile = (userId: number) => {
  return axiosInstance
    .get("/profile/" + userId)
    .then((res) => res.data as ProfileData);
};

/**
 * Get the file name from a google signed URL
 * @param url Google Signed URL
 * @returns
 */
export const getFileNameFromUrl = (url: string, decode?: boolean) => {
  let regex = new RegExp(/(?<=(\/\d+\/))[\W\S_]+(\.\w+)(?=(\?Google))/, "g");

  const result = url.match(regex);

  if (result) return decode ? decodeURIComponent(result[0]) : result[0];
  else return "";
};
