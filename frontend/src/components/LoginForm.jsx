import React from "react";
import { connect } from "react-redux";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Tooltip from "@mui/joy/Tooltip";
import Checkbox from "@mui/joy/Checkbox";

import { LemmyHttp } from "lemmy-js-client";

import { setUserJwt, setInstanceBase } from "../reducers/configReducer";

function LoginForm({ instanceBase, dispatch }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [saveAccount, setSaveAccount] = React.useState(false);

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
      setLoginError(e);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{
          mt: 4,
          p: 2,
          py: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "250px",
          height: "100%",
        }}
      >
        <Typography
          sx={{
            // px: 2,
            display: "flex",
            justifyContent: "center",
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
          }}
        >
          <Input
            placeholder="Instance URL"
            value={instanceBase}
            onChange={(e) => setInstance(e.target.value)}
            variant="outlined"
            color="neutral"
            sx={{ mb: 1 }}
          />
          <Input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
            color="neutral"
            sx={{ mb: 1 }}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="outlined"
            color="neutral"
            sx={{ mb: 1 }}
          />

          <Box>
            <Tooltip title="Your account will be saved locally">
              <Checkbox
                label="Save Account"
                variant="outlined"
                value={saveAccount}
                onChange={() => setSaveAccount(!saveAccount)}
              />
            </Tooltip>
          </Box>

          <Button fullWidth onClick={loginClick} disabled={username.length === 0 || password.length === 0}>
            Login
          </Button>
        </Box>

        {loginError && (
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              fontSize: "0.8rem",
              color: "#ff0000",

              // display: "flex",
              // justifyContent: "center",
              // // pt: 2,
            }}
          >
            {loginError}
          </Typography>
        )}
      </Card>
    </Box>
  );
}

const mapStateToProps = (state) => ({
  userJwt: state.configReducer.userJwt,
  instanceBase: state.configReducer.instanceBase,
});
export default connect(mapStateToProps)(LoginForm);
