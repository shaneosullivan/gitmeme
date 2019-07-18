import React from "react";
import "../App.css";
import getToken from "../shared/auth/getToken";
import { GithubInfo } from "../shared/auth/githubInfo";

import "./Login.css";

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
      getToken(true, async (err: any, info: GithubInfo) => {
        console.log("getToken complete", "Error is ", err, "info is ", info);
        if (err) {
          console.error(err);
        } else {
          console.log("got token info ", info);
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
