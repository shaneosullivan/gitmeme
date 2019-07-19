import React from "react";
import "../App.css";
import getToken from "../shared/auth/getToken";
import { GithubInfo } from "../shared/auth/githubInfo";

import "./Login.css";
import { sendEvent } from "../shared/analytics";

declare const chrome: any;

interface Props {
  onAuth: (authInfo: GithubInfo) => void;
}

const Login = (props: Props) => {
  function _logIn() {
    console.log("Logging in");
    try {
      if (!chrome || !chrome.identity) {
        console.log("Not in an extension");
        return;
      }
      sendEvent("action", "login", "begin", "popup");
      getToken(true, async (err: any, info: GithubInfo) => {
        console.log("getToken complete", "Error is ", err, "info is ", info);
        if (err) {
          sendEvent("action", "login", "fail", "popup");
          console.error(err);
        } else {
          console.log("got token info ", info);
          sendEvent("action", "login", "success", "popup");
          props.onAuth(info);
        }
      });
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="Login">
      <button onClick={_logIn}>Log in with Github</button>
    </div>
  );
};

export default Login;
