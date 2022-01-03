import React, { useCallback, useContext, useEffect, useState } from "react";
import CategoryInput from "../widgets/categoryinput";
import styles from "./profile.module.css";
import AddMediaButton from "../widgets/addmediabutton";
import MainButton from "../widgets/mainbutton";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import MediaDraggable from "../widgets/mediadraggable";
import { Formik } from "formik";
import Loading from "../widgets/loading";
import {
  getFileNameFromUrl,
  getProfile,
  updateOrCreateProfile,
} from "../../services/profile.service";
import { AuthContext } from "../../providers/auth.provider";
import { Media, ProfileData } from "../../types/profile.type";
import { FaTrashAlt } from "react-icons/fa";

const Profile = () => {
  const authContext = useContext(AuthContext);
  let resumeFileInputRef = React.useRef<HTMLInputElement>(null);

  /**
   * media.url => name of the file or the url source
   * If url === "", it means that a Media is not set/empty
   */
  const [resume, setResume] = useState<Media>({ name: "" });
  const [medias, setMedia] = useState<Media[]>([]);
  const [mainMedia, setMainMedia] = useState<Media>({ name: "" });
  const [skills, setSkills] = useState<string[]>([]);

  // For the profile data fetched from API, purely for displaying initial values
  // Do not change this from within the form
  const [profileData, setProfileData] = useState<ProfileData>(
    {} as ProfileData
  );

  const [submitError, setSubmitError] = useState("");

  /**
   * Handle resume input file change
   */
  const handleFileChange = useCallback(
    (type: string) => {
      if (type === "resume" && resumeFileInputRef.current?.files) {
        let file = resumeFileInputRef.current?.files[0];
        setResume({ file, name: file.name });
      }
    },
    [resumeFileInputRef]
  );

  /**
   * Add media
   * @param files list of files to add as media
   */
  const addMedia = (files: FileList) => {
    //TODO: Limit file size

    const temp = medias ? [...Array.from(medias)] : [];
    Array.from(files).forEach((file) => {
      if (medias.find((media) => media.name === file.name)) {
        alert(`File ${file.name} already added`);
      } else temp.push({ file, name: file.name });
    });
    setMedia(temp);
  };

  /**
   * Delete media
   * @param toDelete specific media to delete
   */
  const deleteMedia = (toDelete: Media) => {
    if (mainMedia === toDelete) setMainMedia({ name: "" });

    medias && setMedia(medias.filter((media) => media !== toDelete));
  };

  /**
   * End drag handler for React-beautiful-dnd
   */
  const onDragEndHandler = (result: DropResult) => {
    if (medias && result.destination) {
      const temp = [...Array.from(medias)];
      temp.splice(result.source.index, 1);
      temp.splice(result.destination?.index, 0, medias[result.source.index]);
      setMedia(temp);
    }
  };

  /**
   * Subscribe to file changes for Resume
   */
  useEffect(() => {
    let current = resumeFileInputRef.current;

    if (current) {
      current.addEventListener("change", () => handleFileChange("resume"));

      return () =>
        current?.removeEventListener("change", () =>
          handleFileChange("resume")
        );
    }
  }, [resumeFileInputRef, handleFileChange]);

  /**
   * Init fetched data for the form
   */
  useEffect(() => {
    if (authContext.user)
      getProfile(authContext.user.id).then((data) => {
        setProfileData(data);
        setSkills(data.skills?.split(",") ?? []);

        let resumeFileName =
          data.resumeUrl && getFileNameFromUrl(data.resumeUrl, true);
        setResume({
          name: resumeFileName || "",
          url: data.resumeUrl,
        });

        let mainMediaFileName =
          data.mainMediaUrl && getFileNameFromUrl(data.mainMediaUrl, true);
        let mainMediaObject: Media = {
          name: mainMediaFileName || "",
          url: data.mainMediaUrl,
        };
        setMainMedia(mainMediaObject);

        let parsedMedia: Media[] = [];
        if (data.mainMediaUrl) parsedMedia.push(mainMediaObject);

        parsedMedia = parsedMedia.concat(
          data.mediaUrls?.map((url) => {
            return { url: url, name: getFileNameFromUrl(url, true) } as Media;
          }) ?? []
        );

        setMedia(parsedMedia);
      });
  }, [authContext.user]);

  useEffect(() => {
    console.log("Profile data", profileData);
  }, [profileData]);

  return (
    <section id="profile" className={styles.section}>
      <h1 className={styles.title}>Profile</h1>
      <Formik
        enableReinitialize
        initialValues={{
          ...profileData,
        }}
        onSubmit={async (values) => {
          const data = values as ProfileData;

          data.skills = skills?.toString();
          /**
           * Files
           * if there are new files, upload them
           */
          data.mainMedia = mainMedia?.file;
          data.resume = resume.file;

          let mediaFiles: File[] = [];
          medias?.forEach((media) => {
            if (media.file && media !== mainMedia) mediaFiles.push(media.file);
          });
          data.medias = mediaFiles;

          /**
           * URLs
           * Check since all media's url is also the files name,
           * do not push them if they're  not a url.
           */
          data.mainMediaUrl = mainMedia?.url;
          data.resumeUrl = resume?.url;

          let mediaUrls: string[] = [];
          medias?.forEach((media) => {
            if (media.url && media !== mainMedia) mediaUrls.push(media.url);
          });
          data.medias = mediaFiles;
          data.mediaUrls = mediaUrls;

          try {
            await updateOrCreateProfile(
              authContext.user?.id!,
              values as ProfileData
            );
          } catch (err: any) {
            console.error(err);
            setSubmitError(err.data.message || err.data.errors[0].msg);
          }
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit} className={styles.form}>
            <p>{medias && "click to select as main"}</p>
            <DragDropContext onDragEnd={onDragEndHandler}>
              <Droppable direction="horizontal" droppableId="droppable">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    className={styles.row}
                    ref={provided.innerRef}
                  >
                    {medias &&
                      medias.map((media, i) => (
                        <MediaDraggable
                          media={media}
                          isSelected={media.name === mainMedia.name}
                          key={media.name + i}
                          draggableId={media.name + i}
                          index={i}
                          onClick={() => {
                            if (media !== mainMedia) setMainMedia(media);
                            else setMainMedia({ name: "" });
                          }}
                          onDeleteClick={() => deleteMedia(media)}
                        />
                      ))}
                    {provided.placeholder}
                    <AddMediaButton onFileChange={addMedia} />
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            <div className={styles.row}>
              <div>
                <div className={styles.row}>
                  <div>
                    <label htmlFor="firstName">First Name</label>
                    <input
                      name="firstName"
                      id="firstName"
                      type="text"
                      onChange={handleChange}
                      value={values.firstName || ""}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      name="lastName"
                      id="lastName"
                      type="text"
                      onChange={handleChange}
                      value={values.lastName || ""}
                    />
                  </div>
                </div>

                <div>
                  <label id="skills_label" htmlFor="skillsInput">
                    Skills
                  </label>
                  <CategoryInput
                    id="skillsInput"
                    ariaLabelledBy="skills_label"
                    values={skills}
                    onChange={(skills) => setSkills(skills)}
                  />
                </div>

                <div>
                  <label htmlFor="aboutme">About me</label>
                  <textarea
                    id="aboutme"
                    name="aboutMe"
                    onChange={handleChange}
                    value={values.aboutMe || ""}
                  />
                </div>
              </div>
              <div>
                <div>
                  <label htmlFor="github">Github</label>
                  <input
                    id="github"
                    name="github"
                    type="text"
                    onChange={handleChange}
                    value={values.github || ""}
                  />
                </div>

                <div>
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    onChange={handleChange}
                    value={values.linkedin || ""}
                  />
                </div>

                <div>
                  <label id="resume_title">Resume</label>
                  <div className={styles.row_center}>
                    <label htmlFor="resume" className={styles.browse}>
                      Choose a file
                    </label>
                    <input
                      ref={resumeFileInputRef}
                      type="file"
                      aria-labelledby="resume_title"
                      name="resume"
                      id="resume"
                    />
                    <button
                      type="button"
                      className={styles.trash_button}
                      onClick={() => setResume({ name: "" })}
                    >
                      <FaTrashAlt size={18} />
                    </button>
                    <p>{resume.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <MainButton type="submit">
                {isSubmitting ? <Loading size={20} /> : "Save"}
              </MainButton>
            </div>
            {submitError !== "" && (
              <h3 className="submit-error">{submitError}</h3>
            )}
          </form>
        )}
      </Formik>
    </section>
  );
};

export default Profile;
