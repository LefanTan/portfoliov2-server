import { useCallback, useEffect, useState } from "react";
import styles from "./categoryinput.module.css";

const CategoryInput = () => {
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState<string[]>([]);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isFocus) {
        if (event.key === "Enter" && value !== "") {
          setCategory([...category, value.trim()]);
          setValue("");
        } else if (
          event.key === "Backspace" &&
          category.length > 0 &&
          value === ""
        ) {
          setCategory(category.slice(0, category.length - 1));
        }
      }
    },
    [category, value, isFocus]
  );

  const deleteItem = (index: number) => {
    setCategory(category.filter((val, i) => i !== index));
  };

  const focusOutline = {
    outline: "black solid 1.5px",
  };

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  return (
    <div
      className={styles.container}
      style={isFocus ? focusOutline : undefined}
    >
      {category.map((item, i) => (
        <button onClick={() => deleteItem(i)} type="button" key={item + i}>
          <strong className={styles.strong}>x</strong> {item}
        </button>
      ))}
      <input
        type="text"
        className={styles.input}
        value={value}
        placeholder="type here..."
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(event) => {
          if (event.target.value !== "\n") setValue(event.target.value);
        }}
      />
    </div>
  );
};

export default CategoryInput;
