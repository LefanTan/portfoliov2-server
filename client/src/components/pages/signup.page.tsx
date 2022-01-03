import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/auth.provider";
import styles from "./signin.page.module.css";
import { Formik } from "formik";
import * as Yup from "yup";
import FormError from "../widgets/formerror";
import { useNavigate } from "react-router-dom";
import Loading from "../widgets/loading";
import MainButton from "../widgets/mainbutton";

const SignUpPage = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .required("Username required")
      .min(3, "Minimum 3 characters"),
    email: Yup.string().email("Not a valid email").required("Email required"),
    password: Yup.string().required("Password required"),
  });

  useEffect(() => {
    // check if user already exist in authContext, if so, redirect to homepage
    (async () => {
      let loggedIn = false;

      if (!authContext.user || !authContext.loggedIn) {
        loggedIn = await authContext.sync();
      }

      if (loggedIn) {
        navigate("/home", { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authContext]);

  return (
    <div className={styles.body}>
      <main className={styles.main}>
        <h1 className={styles.h1}>
          Portfolio <strong className={styles.strong}>API</strong>
        </h1>
        <Formik
          validationSchema={SignupSchema}
          initialValues={{
            username: "",
            email: "",
            password: "",
          }}
          onSubmit={async (values) => {
            try {
              await authContext.signup(
                values.username,
                values.email,
                values.password
              );
              navigate("/home", { replace: true });
            } catch (err: any) {
              console.error(err.data);
              setSubmitError(err.data.message || err.data.errors[0].msg);
            }
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
              <label htmlFor="username">Username</label>
              <input
                onChange={handleChange}
                type="text"
                id="username"
                placeholder="Enter your username here"
                name="username"
                className={
                  touched.username && errors.username ? "red-outline" : ""
                }
              />
              <FormError name="username" />

              <label htmlFor="email">Email</label>
              <input
                onChange={handleChange}
                type="email"
                id="email"
                placeholder="Enter your email here"
                name="email"
                className={touched.email && errors.email ? "red-outline" : ""}
              />
              <FormError name="email" />

              <label htmlFor="password">Password</label>
              <input
                onChange={handleChange}
                type="password"
                id="password"
                placeholder="Enter your password here"
                name="password"
                className={
                  touched.password && errors.password ? "red-outline" : ""
                }
              />
              <FormError name="password" />

              {submitError !== "" && (
                <h3 className="submit-error">{submitError}</h3>
              )}

              <MainButton type="submit" style={{ width: "100%" }}>
                {isSubmitting ? (
                  <Loading size={20} mainColor="white" secondaryColor="black" />
                ) : (
                  "Sign up"
                )}
              </MainButton>
            </form>
          )}
        </Formik>
        <a href="/signin" className={styles.direct}>
          already have an account? <strong>sign in here</strong>
        </a>
      </main>
    </div>
  );
};

export default SignUpPage;
