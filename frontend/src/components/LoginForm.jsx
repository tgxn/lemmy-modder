import React from "react";
import { connect } from "react-redux";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";

import { LemmyHttp } from "lemmy-js-client";

import { setUserJwt, setInstanceBase } from "../reducers/configReducer";

function LoginForm({ instanceBase, dispatch }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [loginError, setLoginError] = React.useState("");

  const setInstance = (instance) => {
    dispatch(setInstanceBase(instance));
  };

  // perform login against lemmy instance
  const loginClick = async () => {
    try {
      const lemmyClient = new LemmyHttp(`https://${instanceBase}`);

      const auth = await lemmyClient.login({
        username_or_email: username,
        password: password,
      });

      if (auth.jwt) {
        console.log("Logged in!");
        dispatch(setUserJwt(auth.jwt));
        return;
      }

      console.log(auth);
      setLoginError(auth);
    } catch (e) {
      console.log(e);
      setLoginError(e.message);
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
      }}
    >
      <Typography
        sx={{
          display: "flex",
          justifyContent: "center",
          pb: 2,
        }}
      >
        Login
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Input
          placeholder="Instance URL"
          value={instanceBase}
          onChange={(e) => setInstance(e.target.value)}
          variant="outlined"
          color="neutral"
        />
        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          variant="outlined"
          color="neutral"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          variant="outlined"
          color="neutral"
        />

        <Button onClick={loginClick}>Login</Button>
        {loginError && (
          <Typography
            sx={{
              display: "flex",
              justifyContent: "center",
              pt: 2,
            }}
          >
            {loginError}
          </Typography>
        )}
      </Box>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  userJwt: state.configReducer.userJwt,
  instanceBase: state.configReducer.instanceBase,
});
export default connect(mapStateToProps)(LoginForm);
