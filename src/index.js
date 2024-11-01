import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RtlLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { message } from "antd";
import { useHistory } from "react-router-dom";
import '@fontsource/roboto'; // Import font Roboto

const PrivateRoute = ({ component: Component, ...rest }) => {
  const history = useHistory();
  const user = localStorage.getItem("user");

  const checkTokenExpiration = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");

    if (tokenExpiry) {
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime >= tokenExpiry) {
        localStorage.clear();
        message.warning("Your session has expired. Please log in again.");
        history.push("/auth/sign-in");
      }
    }
  };

  useEffect(() => {
    checkTokenExpiration();
    const interval = setInterval(() => {
      checkTokenExpiration();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? <Component {...props} /> : <Redirect to="/auth/sign-in" />
      }
    />
  );
};

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <ThemeEditorProvider>
        <HashRouter>
          <Switch>
            <Route path="/auth" component={AuthLayout} />
            <Route path="/rtl" component={RtlLayout} />
            <PrivateRoute path="/admin" component={AdminLayout} />
            <Redirect from="/" to="/admin" />
          </Switch>
        </HashRouter>
      </ThemeEditorProvider>
    </React.StrictMode>
  </ChakraProvider>,
  document.getElementById("root")
);
