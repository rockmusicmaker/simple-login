import React from "react";
import "./App.scss";
import { NewAccountForm } from "./components";

function App() {
  return (
    <div className="background">
      <NewAccountForm />
      <img
        className="landing-image"
        src={`${process.env.PUBLIC_URL}/images/landing.jpeg`}
        alt="Landing image"
      />
    </div>
  );
}

export default App;
