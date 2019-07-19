import React, { useState, useEffect, MouseEvent } from "react";
import { API_ROOT_URL } from "../shared/consts";
import { TopTokenItem } from "../types";
import ListWithBadges from "./ListWithBadges";
import { GithubInfo } from "../shared/auth/githubInfo";
import "./TopTokensList.css";
import Login from "./Login";
import createAuthHeader from "../shared/auth/createAuthHeader";

declare const chrome: any;

interface Props {
  userInfo: GithubInfo;
  onAuth: (authInfo: GithubInfo) => void;
}

type TokenList = {
  context: Array<TopTokenItem>;
  user: Array<TopTokenItem>;
  global: Array<TopTokenItem>;
};

export default function TopTokensList(props: Props) {
  const [tokenList, setTokenList] = useState({
    context: [],
    user: [],
    global: []
  } as TokenList);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [pageContext, setPageContext] = useState("");

  useEffect(() => {
    const authHeaders =
      props.userInfo.token && props.userInfo.id !== null
        ? createAuthHeader(props.userInfo.id, props.userInfo.token)
        : {};

    chrome.tabs.query(
      { active: true, currentWindow: true },
      (tabs: Array<any>) => {
        // There will be only one in this array
        const currentTab = tabs[0];

        let tabContext = "";
        if (currentTab) {
          const url: string = currentTab.url;
          const urlParts = url.split("/");
          if (
            urlParts[2] === "github.com" ||
            urlParts[2].endsWith(".github.com")
          ) {
            tabContext = urlParts[3] || "";
            setPageContext(tabContext);
          }
        }

        fetch(`${API_ROOT_URL}/top_tokens?context=${tabContext}`, {
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
      }
    );
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <div className="TopTokensList">
      {!error ? (
        <>
          {tokenList.context && tokenList.context.length > 0 ? (
            <ListWithBadges
              label={`In ${pageContext}`}
              items={tokenList.context}
            />
          ) : null}
          <ListWithBadges label="Trending" items={tokenList.global} />
          <ListWithBadges
            label="Your Memes"
            items={props.userInfo.token ? tokenList.user : []}
            emptyMessage={
              <div className="emptyMsg">
                <div>
                  Log in with your Github account to see the most popular memes
                  used by you and your team
                </div>
                <div>
                  <Login onAuth={props.onAuth} />
                </div>
              </div>
            }
          />
        </>
      ) : (
        <div>Error</div>
      )}
    </div>
  );
}
