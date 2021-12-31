import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Loading from "./widgets/loading";

interface TypeRouteProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * If website is not authenticated, redirect to signin page or else render children
 */
export const PrivateRoute: React.FC<TypeRouteProps> = (props) => {
  const [render, setRender] = useState<React.ReactNode>(
    <div className="center">
      <Loading size={30} />
    </div>
  );

  useEffect(() => {
    if (props.isLoading) return;
    else if (props.isAuthenticated) setRender(props.children);
    else setRender(<Navigate replace to="/signin" />);
  }, [props.isLoading, props.isAuthenticated, props.children]);

  return <>{render}</>;
};

/**
 * If website is already authenticated, redirect to home page or else render children
 */
export const PublicRoute: React.FC<TypeRouteProps> = (props) => {
  const [render, setRender] = useState<React.ReactNode>(
    <div className="center">
      <Loading size={30} />
    </div>
  );

  useEffect(() => {
    if (props.isLoading) return;
    else if (!props.isAuthenticated) setRender(props.children);
    else setRender(<Navigate replace to="/home" />);
  }, [props.isLoading, props.isAuthenticated, props.children]);

  return <>{render}</>;
};
