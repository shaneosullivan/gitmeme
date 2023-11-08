import styles from "./page.module.css";
import ImageList from "./ImageList";
import InstallButton from "./InstallButton";

export default function Home() {
  return (
    <div className={styles.page}>
      <div
        style={{
          textAlign: "center",
          position: "absolute",
          width: "100%",
          left: 0,
        }}
      >
        <InstallButton />
      </div>
      <p style={{ paddingTop: "50px" }}>
        GitMeme brings lots of fun to Github by making it easy to include Gifs
        in your comments. In any text box, just type a forward slash and some
        text to insert an image, e.g <span className="token">/shipit</span>
      </p>
      <div style={{ textAlign: "center" }}>
        <iframe
          className={styles.videoFrame}
          src="https://www.youtube.com/embed/dvNS_MB3CFE?rel=0&amp;controls=0&amp;showinfo=0&autoplay=1"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
      <h2>Trending Memes</h2>
      <ImageList />
    </div>
  );
}
