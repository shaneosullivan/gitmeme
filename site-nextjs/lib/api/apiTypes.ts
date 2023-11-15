import * as express from "express";
export interface AppRequest extends express.Request {
  _user?: {
    uid: string;
    token: string;
    avatar: string;
  };
}

export interface AppResponse extends express.Response {}
