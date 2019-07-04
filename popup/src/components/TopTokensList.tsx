import React, { useState, useEffect } from "react";
import { API_ROOT_URL } from "../shared/consts";

interface Props {}

interface TopTokenItem {
  token: string;
  count: number;
}

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
    const results = fetch(API_ROOT_URL + "/top_tokens")
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
      <h2>Top Tokens</h2>
      {tokenList.global.map((tokenItem: TopTokenItem) => {
        return (
          <div>
            {tokenItem.token}
            <span className="tokenCount">{tokenItem.count}</span>
          </div>
        );
      })}
    </div>
  );
}
