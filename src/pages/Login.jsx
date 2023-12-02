import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Card from "@mui/joy/Card";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Input from "@mui/joy/Input";
import Tooltip from "@mui/joy/Tooltip";
import Checkbox from "@mui/joy/Checkbox";
import Container from "@mui/joy/Container";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import IconButton from "@mui/joy/IconButton";
import Delete from "@mui/icons-material/Delete";

import { LemmyHttp } from "lemmy-js-client";

import {
  addUser,
  setAccountIsLoading,
  setUsers,
  setCurrentUser,
  selectAccountIsLoading,
  selectUsers,
} from "../redux/reducer/accountReducer";

import { BasicInfoTooltip } from "../components/Tooltip.jsx";
import { selectIsInElectron } from "../redux/reducer/configReducer";

export default function LoginForm() {
  const domainLock = window?.RuntimeConfig?.DomainLock != "" ? window?.RuntimeConfig?.DomainLock : false;
  console.log("RuntimeConfig DomainLock", domainLock);

  const dispatch = useDispatch();

  const accountIsLoading = useSelector(selectAccountIsLoading);
  const users = useSelector(selectUsers);
  const isInElectron = useSelector(selectIsInElectron);

  // form state
  const [instanceBase, setInstanceBase] = React.useState(domainLock ? domainLock : "");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [TOTPToken, setTOTPToken] = React.useState("");

  // const [isLoading, setIsLoading] = React.useState(false);

  const [saveSession, setSaveSession] = React.useState(false);

  const [loginError, setLoginError] = React.useState("");

  // perform login against lemmy instance
  const loginClick = async () => {
    // setIsLoading(true);
    dispatch(setAccountIsLoading(true));
    try {
      const lemmyClient = new LemmyHttp(`https://${instanceBase}`);

      const loginPayload = {
        username_or_email: username,
        password: password,
      };

      if (TOTPToken) {
        loginPayload.totp_2fa_token = TOTPToken;
      }

      const auth = await lemmyClient.login(loginPayload);

      // as long aws there is a JWT in the response from login, logged in!
      if (auth.jwt) {
        console.log("auth", auth);

        const lemmyClientAuthed = new LemmyHttp(`https://${instanceBase}`, {
          headers: {
            Authorization: `Bearer ${auth.jwt}`,
          },
        });

        const getSite = await lemmyClientAuthed.getSite();

        // save if they chose to
        if (saveSession) {
          dispatch(addUser({ base: instanceBase, jwt: auth.jwt, site: getSite }));
        }

        // always set the current user on login
        dispatch(setCurrentUser({ base: instanceBase, jwt: auth.jwt, site: getSite }));
      } else {
        setLoginError(auth);
      }
    } catch (e) {
      setLoginError(typeof e == "string" ? e : e.message);
    } finally {
      // setIsLoading(false);
      dispatch(setAccountIsLoading(false));
    }
  };

  const clearData = (keep = false) => {
    window.modder.clearStorage(keep);
    window.location.reload();
  };

  return (
    <Container maxWidth={"sm"} sx={{}}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 0,
        }}
      >
        <Card
          sx={{
            mt: 4,
            p: 2,
            // py: ,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <Typography
            // isLoading={isLoading}
            sx={{
              // px: 2,
              display: "flex",
              justifyContent: "center",
            }}
          >
            Login to a Lemmy Instance
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "60%",
            }}
          >
            <Input
              placeholder="Instance URL"
              value={instanceBase}
              onChange={(e) => (domainLock ? null : setInstanceBase(e.target.value))}
              variant="outlined"
              color="neutral"
              sx={{ mb: 1, width: "100%" }}
              disabled={domainLock || accountIsLoading}
            />
            <Input
              placeholder="Username or Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
              color="neutral"
              sx={{ mb: 1, width: "100%" }}
              disabled={accountIsLoading}
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              color="neutral"
              sx={{
                mb: 1,
                width: "100%",
                "& .MuiInput-input": {
                  caretColor: "#000000",
                  textOverflow: "clip",
                },
              }}
              disabled={accountIsLoading}
            />
            <Input
              placeholder="2FA Code (optional)"
              value={TOTPToken}
              onChange={(e) => setTOTPToken(e.target.value)}
              variant="outlined"
              color="neutral"
              sx={{ mb: 1, width: "100%" }}
              disabled={accountIsLoading}
            />
            <Box
              sx={{
                py: 1,
              }}
            >
              <BasicInfoTooltip title="Will this session will be saved in your browser?" placement="top">
                <Checkbox
                  label="Save Session"
                  variant="outlined"
                  checked={saveSession}
                  onChange={() => setSaveSession(!saveSession)}
                />
              </BasicInfoTooltip>
            </Box>
            <Button
              fullWidth
              onClick={loginClick}
              disabled={instanceBase.length === 0 || username.length === 0 || password.length === 0}
              loading={accountIsLoading}
            >
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

        {users && users.length > 0 && (
          <Card
            sx={{
              mt: 4,
              p: 2,
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography
              // isLoading={isLoading}
              sx={{
                // px: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              Saved Sessions
            </Typography>
            <List sx={{ width: "100%" }}>
              {users.map((user, index) => {
                // @TODO when Lemmy adds `expires_at` to the JWT, we can use this to check if the session is expired
                // const jwt = jwt_decode(user.jwt, { complete: true });

                return (
                  <ListItem
                    key={index}
                    disabled={accountIsLoading}
                    sx={{
                      mb: 0.5,
                      overflow: "hidden",
                    }}
                    endAction={
                      <IconButton
                        aria-label="Delete"
                        size="sm"
                        color="danger"
                        onClick={() => {
                          // remove the current index
                          const newUsers = users.filter((_, i) => i !== index);

                          dispatch(setUsers(newUsers));
                        }}
                      >
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemButton
                      disabled={accountIsLoading}
                      sx={{
                        borderRadius: 4,
                      }}
                      variant="outlined"
                      color="neutral"
                      onClick={async () => {
                        dispatch(setAccountIsLoading(true));

                        try {
                          const lemmyClientAuthed = new LemmyHttp(`https://${user.base}`, {
                            headers: {
                              Authorization: `Bearer ${user.jwt}`,
                            },
                          });

                          const getSite = await lemmyClientAuthed.getSite();

                          if (!getSite || !getSite.my_user) {
                            // set instance base to the current instance for easy login
                            setInstanceBase(user.base);
                            setUsername(user.site.my_user.local_user_view?.person.name);

                            throw new Error("jwt does not provide auth, re-authenticate");
                          }

                          // session is already saved
                          dispatch(setCurrentUser({ base: user.base, jwt: user.jwt, site: getSite }));
                        } catch (e) {
                          setLoginError(typeof e == "string" ? e : e.message);
                        } finally {
                          // setIsLoading(false);
                          dispatch(setAccountIsLoading(false));
                        }
                      }}
                    >
                      <ListItemContent
                        sx={
                          {
                            //strikethrough
                            // textDecoration: expired ? "line-through" : "none",
                          }
                        }
                      >
                        {user.site.my_user?.local_user_view?.person.display_name}
                      </ListItemContent>
                      {/* <ListItemContent>
                        {!expired && (
                          <Typography sx={{ color: "#00ff00" }}>
                            (expires in{" "}
                            <Moment fromNow ago>
                              {jwt.iat * 1000}
                            </Moment>
                            )
                          </Typography>
                        )}
                        {expired && (
                          <Typography sx={{ color: "#ff0000" }}>
                            (expired <Moment fromNow>{jwt.iat * 1000}</Moment>)
                          </Typography>
                        )}
                      </ListItemContent> */}
                      <ListItemContent>
                        <Typography>
                          {user.site.my_user?.local_user_view?.person.name}@{user.base}
                        </Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        )}

        {isInElectron && (
          <Card
            sx={{
              mt: 4,
              p: 2,
              py: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
            }}
          >
            <Typography>Clear Data</Typography>

            <Box
              sx={{
                maxWidth: "300px",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              <Button
                size="sm"
                fullWidth
                color="warning"
                onClick={() => clearData(true)}
                disabled={accountIsLoading}
              >
                Clean storage (keep users)
              </Button>

              <Button
                size="sm"
                fullWidth
                color="danger"
                onClick={() => clearData(false)}
                disabled={accountIsLoading}
              >
                Purge storage
              </Button>
            </Box>
          </Card>
        )}
      </Box>
    </Container>
  );
}
