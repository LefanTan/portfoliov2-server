import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../providers/auth.provider";
import styles from "./signin.page.module.css";
import { Formik } from "formik";
import Loading from "../loading";
import * as Yup from "yup";
import FormError from "../formerror";
import { useNavigate } from "react-router-dom";

interface SignInProp {
  signout?: boolean;
}

const SignInPage = (props: SignInProp) => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");

  const SigninSchema = Yup.object().shape({
    username_email: Yup.string().required("Username or email required"),
    password: Yup.string().required("Password required"),
  });

  useEffect(() => {
    // check if user already exist in authContext, if so, redirect to homepage
    (async () => {
      if (props.signout) {
        await authContext.signout();
        return;
      }

      let loggedIn = false;

      if (!authContext.user || !authContext.loggedIn) {
        loggedIn = await authContext.sync();
      }

      if (loggedIn) {
        navigate("/home", { replace: true });
      }
    })();
  }, []);

  return (
    <div className={styles.body}>
      <main className={styles.main}>
        <h1 className={styles.h1}>
          Portfolio <strong className={styles.strong}>API</strong>
        </h1>
        <Formik
          validationSchema={SigninSchema}
          initialValues={{
            username_email: "",
            password: "",
          }}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const res = await authContext.signin(
                values.username_email,
                values.password
              );

              navigate("/home", { replace: true });
            } catch (err: any) {
              setSubmitError(err.data.message || err.data.errors[0].msg);
            }
            setSubmitting(false);
          }}
        >
          {({
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit} className={styles.form}>
              <label htmlFor="username_email">Username / Email</label>
              <input
                onChange={handleChange}
                type="text"
                id="username_email"
                placeholder="Enter your username or email here"
                name="username_email"
                className={
                  touched.username_email && errors.username_email
                    ? "red-outline"
                    : ""
                }
              />
              <FormError name="username_email" />

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
                <h3 className={styles.submit_error}>{submitError}</h3>
              )}

              <input
                onChange={handleChange}
                name="remember"
                id="remember"
                type="checkbox"
                className={styles.checkbox}
              />
              <label htmlFor="remember" className={styles.remember}>
                Remember me for 30 days
              </label>

              <button className={styles.submit} type="submit">
                {isSubmitting ? <Loading size={20} /> : "Sign in"}
              </button>
            </form>
          )}
        </Formik>
        <a href="/signup" className={styles.direct}>
          don't have an account? <strong>sign up here</strong>
        </a>
      </main>
    </div>
  );
};

export default SignInPage;
