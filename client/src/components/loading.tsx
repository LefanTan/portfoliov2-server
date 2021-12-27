import React from "react";
import styles from "./loading.module.css";

interface LoadingProps {
  style?: string;
  size: number;
}

const Loading: React.FC<LoadingProps> = (props) => {
  const sizeStyle = {
    width: `${props.size}px`,
    height: `${props.size}px`,
  };

  return (
    <div className={`${styles.loading} ${props.style}`} style={sizeStyle} />
  );
};

export default Loading;
