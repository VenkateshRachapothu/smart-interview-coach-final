

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App";
import { InterviewProvider } from "./context/InterviewContext";
import { AuthProvider } from "./context/AuthContext";

const GOOGLE_CLIENT_ID = "556527218856-q7a7vf9ptstq2le2v6mvk7qp5g3s6oda.apps.googleusercontent.com";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <ThemeProvider>
      <AuthProvider>
        <InterviewProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </InterviewProvider>
      </AuthProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
);