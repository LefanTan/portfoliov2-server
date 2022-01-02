import { createIf } from "typescript";
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

  return axiosInstance.put("/profile/" + userId, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getProfile = (userId: number) => {
  return axiosInstance
    .get("/profile/" + userId)
    .then((res) => res.data as ProfileData);
};