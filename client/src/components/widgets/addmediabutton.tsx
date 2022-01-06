import React, { useEffect, useState } from "react";
import { FaPhotoVideo } from "react-icons/fa";
import styles from "./addmediabutton.module.css";

interface AddMediaButtonProps {
  text?: string;
  onClick?: () => void;
  onFileChange: (files: FileList) => void;
  multiple?: boolean;
}

const AddMediaButton: React.FC<AddMediaButtonProps> = (props) => {
  const inputRef = React.createRef<HTMLInputElement>();
  const [focus, setFocus] = useState(false);

  const outline = {
    outline: "var(--main) dashed 2px",
  };

  useEffect(() => {
    let current = inputRef.current;

    const onFileHandler = () => {
      if (current && current.files) props.onFileChange(current.files);
    };

    if (current) {
      current.addEventListener("change", onFileHandler);

      return () => current?.removeEventListener("change", onFileHandler);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef, props.onFileChange]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        name="addmedia"
        accept="video/*,image/*"
        multiple={props.multiple ?? true}
        id="addmedia"
      />
      <label
        htmlFor="addmedia"
        onClick={props.onClick}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={styles.add_media_button}
        style={focus ? outline : undefined}
      >
        <FaPhotoVideo className={styles.photo_video_icon} />
        <p className={styles.p}>Add Media</p>
      </label>
    </>
  );
};

export default AddMediaButton;
