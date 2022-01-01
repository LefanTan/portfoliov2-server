import React, { Ref, useCallback, useEffect, useState } from "react";
import CategoryInput from "../widgets/categoryinput";
import styles from "./profile.module.css";
import AddMediaButton from "../widgets/addmediabutton";
import MainButton from "../widgets/mainbutton";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import MediaDraggable from "../widgets/mediadraggable";
import { Formik } from "formik";

const Profile = () => {
  let resumeFileInputRef = React.useRef<HTMLInputElement>(null);

  const [resumeFile, setResumeFile] = useState<File>();
  const [medias, setMedia] = useState<File[]>();
  const [mainMedia, setMainMedia] = useState<File>();
  const [categories, setCategories] = useState<string[]>([]);

  const handleFileChange = useCallback(
    (type: string) => {
      if (type === "resume" && resumeFileInputRef.current?.files) {
        setResumeFile(resumeFileInputRef.current?.files[0]);
      }
    },
    [resumeFileInputRef]
  );

  const addMedia = (files: FileList) => {
    //TODO: Limit file size

    const temp = medias ? [...Array.from(medias)] : [];
    Array.from(files).forEach((file) => temp.push(file));
    setMedia(temp);

    if (typeof mainMedia == "undefined") setMainMedia(temp[0]);
  };

  const deleteMedia = (toDelete: File) => {
    if (mainMedia === toDelete) setMainMedia(undefined);

    medias && setMedia(medias.filter((media) => media !== toDelete));
  };

  const onDragEndHandler = (result: DropResult) => {
    if (medias && result.destination) {
      const temp = [...Array.from(medias)];
      temp.splice(result.source.index, 1);
      temp.splice(result.destination?.index, 0, medias[result.source.index]);
      setMedia(temp);
    }
  };

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

  return (
    <section id="profile" className={styles.section}>
      <h1 className={styles.title}>Profile</h1>
      <Formik
        initialValues={{
          firstName: "",
          lastName: "",
          categories: categories,
          aboutMe: "",
          linkedin: "",
          github: "",
          resumeUrl: null,
          mediaUrls: null,
        }}
        onSubmit={(values) => {
          console.log(values);
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
                          isSelected={media === mainMedia}
                          key={media.name + i}
                          draggableId={media.name + i}
                          index={i}
                          onClick={() => setMainMedia(media)}
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
                      value={values.firstName}
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      name="lastName"
                      id="lastName"
                      type="text"
                      onChange={handleChange}
                      value={values.lastName}
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
                    values={categories}
                    onChange={(categories) => {
                      values.categories = categories;
                      setCategories(categories);
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="aboutme">About me</label>
                  <textarea
                    id="aboutme"
                    name="aboutMe"
                    onChange={handleChange}
                    value={values.aboutMe}
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
                    value={values.github}
                  />
                </div>

                <div>
                  <label htmlFor="linkedin">LinkedIn</label>
                  <input
                    id="linkedin"
                    name="linkedin"
                    type="text"
                    onChange={handleChange}
                    value={values.linkedin}
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
                    <p>{resumeFile?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.row}>
              <MainButton type="submit">Save</MainButton>
            </div>
          </form>
        )}
      </Formik>
    </section>
  );
};

export default Profile;
