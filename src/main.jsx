import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import CustomPrivyProvider from "./privy/PrivyProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CustomPrivyProvider>
      <App />
    </CustomPrivyProvider>
  </React.StrictMode>
);
