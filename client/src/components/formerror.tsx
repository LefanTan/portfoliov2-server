import { ErrorMessage } from "formik";
import styles from "./formerror.module.css";
import React from "react";

interface FormErrorProps {
  name: string;
}

const FormError: React.FC<FormErrorProps> = (props) => {
  return (
    <ErrorMessage
      name={props.name}
      render={(msg) => <h3 className={styles.h3}>{msg}</h3>}
    />
  );
};

export default FormError;
