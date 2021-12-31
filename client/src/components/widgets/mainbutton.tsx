import styles from "./mainbutton.module.css";

interface MainButtonProps {
  type?: "button" | "submit" | "reset" | undefined;
  onclick?: () => void;
}

const MainButton: React.FC<MainButtonProps> = (props) => {
  return (
    <button className={styles.button} onClick={props.onclick} type={props.type}>
      {props.children}
    </button>
  );
};

export default MainButton;
