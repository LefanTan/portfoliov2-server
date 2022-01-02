import { useCallback, useEffect, useState } from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import styles from "./categoryinput.module.css";

interface CategoryInputProps {
  onChange: (list: string[]) => void;
  values: string[];
  ariaLabel?: string;
  ariaLabelledBy?: string;
  id?: string;
}

const CategoryInput: React.FC<CategoryInputProps> = (props) => {
  const [value, setValue] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [category, setCategory] = useState<string[]>(props.values);

  const keyDownHandler = useCallback(
    (event: KeyboardEvent) => {
      if (isFocus) {
        if (event.key === "Enter" && value !== "") {
          event.preventDefault();
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
    if (props.values !== category) props.onChange(category);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  useEffect(() => {
    setCategory(props.values);
  }, [props.values]);

  useEffect(() => {
    window.addEventListener("keydown", keyDownHandler);

    return () => window.removeEventListener("keydown", keyDownHandler);
  }, [keyDownHandler]);

  return (
    <div
      aria-labelledby={props.ariaLabelledBy}
      aria-label={props.ariaLabel}
      role="group"
      id={props.id}
      className={styles.container}
      style={isFocus ? focusOutline : undefined}
    >
      {props.values.map((item, i) => (
        <button
          aria-label="category-button"
          onClick={() => deleteItem(i)}
          type="button"
          key={item + i}
        >
          <FaRegTimesCircle size={12} />
          &nbsp;{item}
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
