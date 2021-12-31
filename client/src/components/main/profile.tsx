import React, { useCallback, useEffect, useState } from "react";
import CategoryInput from "../widgets/categoryinput";
import styles from "./profile.module.css";
import AddMediaButton from "../widgets/addmediabutton";

const Profile = () => {
  let resumeFileInputRef = React.createRef<HTMLInputElement>();
  const [resumeFile, setResumeFile] = useState<File>();
  const [medias, setMedia] = useState<File[]>();

  const handleFileChange = useCallback(
    (type: string) => {
      if (type === "resume" && resumeFileInputRef.current?.files) {
        setResumeFile(resumeFileInputRef.current?.files[0]);
      }
    },
    [resumeFileInputRef]
  );

  const addMedia = (files: FileList) => {
    const temp = medias ? [...Array.from(medias)] : [];
    Array.from(files).forEach((file) => temp.push(file));
    setMedia(temp);
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
      <form className={styles.form}>
        {medias && <p>click to select as main</p>}
        <div className={styles.row}>
          {medias &&
            medias.map((media) => (
              <div
                key={media.name}
                className={styles.media_container}
                role="media"
              >
                <button type="button" className={styles.image_button}>
                  <img src={URL.createObjectURL(media)} />
                </button>
              </div>
            ))}
          <AddMediaButton onFileChange={addMedia} />
        </div>

        <div className={styles.row}>
          <div>
            <div className={styles.row}>
              <div>
                <label className={styles.input}>First Name</label>
                <input type="text" />
              </div>
              <div>
                <label>Last Name</label>
                <input type="text" />
              </div>
            </div>

            <div>
              <label>Skills</label>
              <CategoryInput />
            </div>

            <div>
              <label>About me</label>
              <textarea />
            </div>
          </div>
          <div>
            <div>
              <label>Github</label>
              <input type="text" />
            </div>

            <div>
              <label>LinkedIn</label>
              <input type="text" />
            </div>

            <div>
              <label id="resume_title">Resume</label>
              <div className={styles.row}>
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
      </form>
    </section>
  );
};

export default Profile;
