import React, { useContext } from "react";
import "./loader.css";
import LoaderContext from "./LoaderContext";

const Loader = () => {
  const { isLoading } = useContext(LoaderContext);
  console.log("isloading ", isLoading)
  if (isLoading) {
    return (
      <div className="loader__wrapper">
        <span className="loader"></span>
      </div>
    );
  }
};

export default Loader;
