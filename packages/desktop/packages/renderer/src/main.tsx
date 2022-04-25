import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./samples/electron-store";
import "./samples/preload-module";
import "./styles/index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

// TODO: 加载完再 remove loading
window.removeLoading();
