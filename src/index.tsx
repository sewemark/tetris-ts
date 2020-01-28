import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./scss/index.scss";
import * as serviceWorker from "./serviceWorker";

window.requestAnimationFrame = (function() {
  return (
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    // window.mozRequestAnimationFrame ||
    // window.oRequestAnimationFrame ||
    // window.msRequestAnimationFrame ||
    function(callback: any, element: any) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
