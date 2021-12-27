import React from "react";
import { Navigate } from "react-router-dom";

interface TypeRouteProps {
  isAuthenticated: boolean;
}

/**
 * If website is not authenticated, redirect to signin page or else render children
 */
export const PrivateRoute: React.FC<TypeRouteProps> = (props) => {
  return (
    <>
      {props.isAuthenticated ? (
        props.children
      ) : (
        <Navigate replace to="/signin" />
      )}
    </>
  );
};

/**
 * If website is already authenticated, redirect to home page or else render children
 */
export const PublicRoute: React.FC<TypeRouteProps> = (props) => {
  return (
    <>
      {!props.isAuthenticated ? (
        props.children
      ) : (
        <Navigate replace to="/home" />
      )}
    </>
  );
};
