import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import url_24 from "../url";
import "./index.css";

const LoginForm = ({ onTokenChange }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("invalid request");

  const onChangeUsername = (event) => {
    setUsername(event.target.value);
  };

  const onChangePassword = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set("jwtToken", jwtToken, {
      expires: 30,
      path: "/",
    });
    onTokenChange(jwtToken);
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
    console.log(errorMsg);
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const userDetails = { username, password };
    const url = `${url_24}/login`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorMessage = await response.text();
        onSubmitFailure(errorMessage);
        return;
      }

      const data = await response.json();
      if (response.status === 200) {
        onSubmitSuccess(data.jwtToken);
      } else {
        const errorMessage = await response.text();
        onSubmitFailure(errorMessage);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  const renderPasswordField = () => (
    <>
      <label className="input-labela" htmlFor="password">
        PASSWORD
      </label>
      <br />
      <input
        type="password"
        id="password"
        className="password-input-fielda"
        value={password}
        placeholder="Enter your Password"
        onChange={onChangePassword}
      />
    </>
  );

  const renderUsernameField = () => (
    <>
      <label className="input-labela" htmlFor="username">
        USER ID
      </label>
      <input
        type="text"
        id="username"
        className="username-input-fielda"
        value={username}
        placeholder="Enter your user ID"
        onChange={onChangeUsername}
      />
    </>
  );

  const jwtToken = Cookies.get("jwtToken");
  if (jwtToken !== undefined) {
    return <Navigate to="/home" />;
  }

  return (
    <div className="login-bga">
      <div className="login-form-container-forma">
        <form className="form-containerx" onSubmit={submitForm}>
          <h1 className="mainPagelogina">Login</h1>
          <div className="input-containera">{renderUsernameField()}</div>
          <div className="input-container">{renderPasswordField()}</div>
          <div>
            {showSubmitError && <p className="error-message">*{errorMsg}</p>}
          </div>
          <div>
            <button type="submit" className="login-buttona">
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
