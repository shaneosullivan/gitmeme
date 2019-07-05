import React, { useState, useEffect, MouseEvent } from "react";
import { API_ROOT_URL } from "../shared/consts";
import { TopTokenItem } from "../types";
import ListWithBadges from "./ListWithBadges";
import { GithubInfo } from "../shared/auth/githubInfo";
import "./TopTokensList.css";
import Login from "./Login";
import createAuthHeader from "../shared/auth/createAuthHeader";
import { userInfo } from "os";

interface Props {
  userInfo: GithubInfo;
  onAuth: (authInfo: GithubInfo) => void;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authHeaders =
      props.userInfo.token && props.userInfo.id !== null
        ? createAuthHeader(props.userInfo.id, props.userInfo.token)
        : {};

    fetch(API_ROOT_URL + "/top_tokens", {
      headers: authHeaders
    })
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        throw new Error("Failed to fetch top tokens");
      })
      .then((results: TokenList) => {
        setTokenList(results);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="TopTokensList">
      {!error ? (
        <>
          <ListWithBadges label="Global Top Memes" items={tokenList.global} />
          {props.userInfo.token ? (
            <ListWithBadges label="My Top Memes" items={tokenList.user} />
          ) : (
            <div>
              <h2>My Top Memes</h2>
              <div>
                You must log in with your Github account to see the most popular
                memes used by you and in your company as a whole
              </div>
              <div>
                <Login onAuth={props.onAuth} />
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Error</div>
      )}
    </div>
  );
}
