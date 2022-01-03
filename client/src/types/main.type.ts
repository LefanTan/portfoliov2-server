export type ProfileData = {
  firstName?: string;
  lastName?: string;
  // an array seperated by comma
  // Do skills.split(',') to get list of skills
  skills?: string;
  aboutMe?: string;
  linkedin: string;
  github: string;

  resume?: File;
  mainMedia?: File;
  medias?: File[];

  resumeUrl?: string;
  mainMediaUrl?: string;
  mediaUrls?: string[];
};

export type ProjectData = {
  name: string;
};

/**
 * url - url of media
 */
export type Media = {
  file?: File;
  url?: string;
  name: string;
};
