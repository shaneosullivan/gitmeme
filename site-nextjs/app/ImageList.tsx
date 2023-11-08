"use client";

import { API_ROOT_URL } from "@/lib/shared/consts";
import { useEffect, useState } from "react";
import styles from "./ImageList.module.css";

interface ApiTokenInfo {
  token: string;
  image_url: string;
  count: number;
}

interface ApiTokenResult {
  global: Array<ApiTokenInfo>;
  user: Array<ApiTokenInfo>;
}

export default function ImageList() {
  const [topTokens, setTopTokens] = useState([] as Array<ApiTokenInfo>);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetch(`${API_ROOT_URL}/top_tokens?count=10`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Top tokens fetch failed");
        }
      })
      .then((res: ApiTokenResult) => {
        setTopTokens(res.global);
      })
      .catch((err) => {
        console.error(err);
        setLoadError("Failed to load top tokens");
      });
  }, []);

  return (
    <div className={styles.root}>
      {loadError ? (
        <div style={{ color: "red" }}>
          Failed to load Trending Memes. Please refresh the page to try again
        </div>
      ) : (
        topTokens.map((token, idx) => {
          return (
            <span key={idx} className={styles.imageContainer}>
              <h3>/{token.token}</h3>
              <img src={token.image_url} style={{ maxHeight: "150px" }} />
            </span>
          );
        })
      )}
    </div>
  );
}
