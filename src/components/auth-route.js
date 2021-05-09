import React from "react";
import { Redirect, Route } from "react-router";

export default function AuthRoute(props){
  const { type } = props;
  let isAuthenticated = window.localStorage.credential !== undefined;

  if (type === "semAuth" && isAuthenticated) return <Redirect to="/" />;
  else if (type === "comAuth" && !isAuthenticated) return <Redirect to="/login" />;

  return <Route {...props} />;
};