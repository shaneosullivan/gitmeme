import React, { useState, useEffect } from "react";
import { API_ROOT_URL } from "../shared/consts";
import { TopTokenItem } from "../types";
import ListWithBadges from "./ListWithBadges";

interface Props {}

type TokenList = {
  user: Array<TopTokenItem>;
  global: Array<TopTokenItem>;
};

export default function TopTokensList(props: Props) {
  const [tokenList, setTokenList] = useState({
    user: [],
    global: []
  } as TokenList);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(API_ROOT_URL + "/top_tokens")
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        throw new Error("Failed to fetch top tokens");
      })
      .then((results: TokenList) => {
        setTokenList(results);
      })
      .catch(err => {
        setError(err.message);
      });
  }, []);

  return (
    <div className="TopTokensList">
      {!error ? (
        <ListWithBadges label="Top Tokens" items={tokenList.global} />
      ) : (
        <div>Error</div>
      )}
    </div>
  );
}
