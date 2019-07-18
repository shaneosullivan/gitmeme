import * as React from "react";

import "./Help.css";
import "./token.css";

export default function Help() {
  return (
    <div className="Help">
      <strong>
        <a href="https://gitme.me" target="_blank">
          GitMeme
        </a>
      </strong>{" "}
      brings lots of fun to Github by making it easy to include Gifs in your
      comments. In any text box, just type a forward slash and some text to
      search for an image, e.g <span className="token">/shipit</span>
    </div>
  );
}
