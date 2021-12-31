import { useState } from "react";
import styles from "./header.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import { MdOutlineClear } from "react-icons/md";

export function Header() {
  const [showNavBar, setShowBar] = useState(false);

  return (
    <header className={styles.header}>
      <h1 className={styles.h1}>
        Portfolio <strong>API</strong>
      </h1>
      <nav
        className={
          showNavBar ? `${styles.nav}  ${styles.nav_active}` : styles.nav
        }
      >
        <button className={styles.clear} onClick={() => setShowBar(false)}>
          <MdOutlineClear className={styles.clear_icon} />
        </button>
        <ul className={styles.nav_links}>
          <li>
            <a href="#profile">Profile</a>
          </li>
          <li>
            <a href="#">Projects</a>
          </li>
          <li>
            <a href="/signout">Sign out</a>
          </li>
        </ul>
      </nav>
      <button className={styles.burger} onClick={() => setShowBar(true)}>
        <AiOutlineMenu className={styles.burger_icon} />
      </button>
    </header>
  );
}
