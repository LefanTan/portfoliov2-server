import styles from "./notfound.module.css";

const NotFoundPage = () => {
  return (
    <div className="body">
      <main className={styles.main}>
        <h1>404 Not Found</h1>
        <p>there's nothing really interesting here</p>
        <p>ps: you're looking good today btw</p>
        <img
          alt="sus emoji"
          src={
            "https://i.pinimg.com/originals/71/94/e0/7194e057d1ff38aa633d714cea416cca.png"
          }
        />
      </main>
    </div>
  );
};

export default NotFoundPage;
