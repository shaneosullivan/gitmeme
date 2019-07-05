import React from "react";
import "../App.css";
import getToken from "../shared/auth/getToken";
import { GithubInfo } from "../shared/auth/githubInfo";

declare const chrome: any;

interface Props {
  onAuth: (authInfo: GithubInfo) => void;
}

const Login = (props: Props) => {
  function _logIn() {
    if (!chrome || !chrome.identity) {
      console.log("Not in an extension");
      return;
    }
    getToken(true, async (err: any, info: GithubInfo) => {
      if (err) {
        console.error(err);
      } else {
        console.log("got token info ", info);
        props.onAuth(info);
      }
    });
  }
  return (
    <div className="Login">
      <button onClick={_logIn}>Log in with Github</button>
    </div>
  );
};

export default Login;
