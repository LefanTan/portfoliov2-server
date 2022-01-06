import { ProfileData, ProjectData } from "../types/main.type";
import axiosInstance from "./axiosInstance";

export const updateOrCreateProfile = (userId: number, profile: ProfileData) => {
  let formData = new FormData();
  Object.entries(profile).forEach(([key, value]) => {
    if (typeof value == "undefined" || value == null) return;
    if (Array.isArray(value)) {
      value.forEach((entry) => {
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

export const getProjects = (userId: number) => {
  return axiosInstance
    .get("/projects/" + userId)
    .then((res) => res.data as ProjectData[]);
};

export const getProject = (projectId: number) => {
  return axiosInstance
    .get("/project/" + projectId)
    .then((res) => res.data as ProjectData);
};

export const createProject = (userId: number, projectData: ProjectData) => {
  let formData = new FormData();
  Object.entries(projectData).forEach(([key, value]) => {
    if (typeof value == "undefined" || value == null) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        formData.append(key, entry);
      });
    } else {
      let parsed: File | string;
      if (typeof value === "boolean" || typeof value === "number")
        parsed = value.toString();
      else parsed = value;
      formData.append(key, parsed);
    }
  });

  return axiosInstance.post("/projects/" + userId, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateProject = (projectId: number, projectData: ProjectData) => {
  let formData = new FormData();
  Object.entries(projectData).forEach(([key, value]) => {
    if (typeof value == "undefined" || value == null) return;

    if (Array.isArray(value)) {
      value.forEach((entry) => {
        formData.append(key, entry);
      });
    } else {
      let parsed: File | string;
      if (typeof value === "boolean" || typeof value === "number")
        parsed = value.toString();
      else parsed = value;
      formData.append(key, parsed);
    }
  });

  return axiosInstance.put("/project/" + projectId, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Get the file name from a google signed URL
 * @param url Google Signed URL
 * @returns
 */
export const getFileNameFromUrl = (url: string, decode?: boolean) => {
  let regex = new RegExp(/[^\/]+(\.\w+)(?=(\?Google))/, "g");

  const result = url.match(regex);

  if (result) return decode ? decodeURIComponent(result[0]) : result[0];
  else return "";
};
