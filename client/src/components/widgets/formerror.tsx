import { ErrorMessage } from "formik";
import styles from "./formerror.module.css";
import React from "react";
import { MdError } from "react-icons/md";

interface FormErrorProps {
  name: string;
}

const FormError: React.FC<FormErrorProps> = (props) => {
  return (
    <ErrorMessage
      name={props.name}
      render={(msg) => (
        <h3 className={styles.h3}>
          <MdError />
          {msg}
        </h3>
      )}
    />
  );
};

export default FormError;
