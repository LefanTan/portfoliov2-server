import styles from "./mainbutton.module.css";

interface MainButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  onclick?: () => void;
  style?: React.CSSProperties;
  contrast?: boolean;
}

const MainButton: React.FC<MainButtonProps> = (props) => {
  return (
    <button
      className={styles.button + " " + (props.contrast && styles.contrast)}
      style={props.style}
      onClick={props.onclick}
      type={props.type}
    >
      {props.children}
    </button>
  );
};

export default MainButton;
