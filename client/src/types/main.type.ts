export type ProfileData = {
  firstName?: string;
  lastName?: string;
  // an array seperated by comma
  // Do skills.split(',') to get list of skills
  skills?: string[];
  aboutMe?: string;
  linkedin?: string;
  github?: string;

  resume?: File;
  mainMedia?: File;
  medias?: File[];

  resumeUrl?: string;
  mainMediaUrl?: string;
  mediaUrls?: string[];
};

export type ProjectData = {
  id: number;
  title: string;
  shortDescription: string;
  order: number;

  description?: string;
  stack?: string[];
  link?: string;
  repo?: string;
  type?: string;
  purposeAndGoal?: string;
  problems?: string;
  lessonsLearned?: string;
  inProgress?: boolean;

  mainMedia?: File;
  medias?: File[];

  mainMediaUrl?: string;
  mediaUrls?: string[];
};

/**
 * url - url of media
 */
export type Media = {
  file?: File;
  url?: string;
  name: string;
};
