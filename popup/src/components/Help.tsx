import * as React from "react";

export default function Help() {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">How to use GitMeme</h5>
        <p>
          <a href="https://gitme.me" target="_blank">
            GitMeme
          </a>{" "}
          brings lots of fun to Github by making it really easy to include Gifs
          and other images in your comments. In any text box, just type a
          forward slash and some text to search for an image, e.g{" "}
          <span style={{ backgroundColor: "#999999", color: "white" }}>
            /shipit
          </span>
        </p>
      </div>
    </div>
  );
}
