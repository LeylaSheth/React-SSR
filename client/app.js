import React from "react";
import ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader"; // eslint-disable-line
import App from "./App.jsx";

const root = document.getElementById("root");

// 配置热更新
const render = (Component) => {
  const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;
  renderMethod(
    <AppContainer>
      <Component />
    </AppContainer>,
    root
  );
};

render(App);

if (module.hot) {
  module.hot.accept("./App.jsx", () => {
    // require会默认加载所有export内容，所以加default
    const NextApp = require("./App.jsx").default; // eslint-disable-line
    render(NextApp);
  });
}
