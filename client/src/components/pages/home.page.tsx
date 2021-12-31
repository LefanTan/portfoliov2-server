import { Header } from "../main/header";
import Profile from "../main/profile";
import styles from "./home.module.css";

const HomePage = () => {
  return (
    <div className="body">
      <Header />
      <main className={styles.main}>
        {/* <h1 className={styles.title}>Welcome to your portfolio API, Lefan</h1> */}
        <Profile />
      </main>
    </div>
  );
};

export default HomePage;
