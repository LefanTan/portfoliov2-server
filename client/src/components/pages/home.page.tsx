import { Header } from "../main/header";
import Profile from "../main/profile";
import Projects from "../main/projects.module";
import styles from "./home.module.css";

const HomePage = () => {
  return (
    <div className="body">
      <Header />
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome back!</h1>
        <Profile />
        <Projects />
      </main>
    </div>
  );
};

export default HomePage;
