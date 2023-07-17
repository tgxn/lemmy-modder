import React from "react";

import Moment from "react-moment";

import { useDispatch, useSelector } from "react-redux";

import jwt_decode from "jwt-decode";

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

import { addUser, setUsers, setCurrentUser } from "../reducers/accountReducer";

export default function LoginForm() {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.accountReducer.users);

  const [instanceBase, setInstanceBase] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);

  const [saveSession, setSaveSession] = React.useState(false);

  const [loginError, setLoginError] = React.useState("");

  // perform login against lemmy instance
  const loginClick = async () => {
    setIsLoading(true);
    try {
      const lemmyClient = new LemmyHttp(`https://${instanceBase}`);

      const auth = await lemmyClient.login({
        username_or_email: username,
        password: password,
      });

      if (auth.jwt) {
        const getSite = await lemmyClient.getSite({
          auth: auth.jwt,
        });

        if (saveSession) {
          dispatch(addUser(instanceBase, auth.jwt, getSite));
        } else {
          dispatch(setCurrentUser(instanceBase, auth.jwt, getSite));
        }
      } else {
        setLoginError(auth);
      }
    } catch (e) {
      setLoginError(typeof e == "string" ? e : e.message);
    } finally {
      setIsLoading(false);
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
            }}
          >
            <Input
              placeholder="Instance URL"
              value={instanceBase}
              onChange={(e) => setInstanceBase(e.target.value)}
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

            <Button
              fullWidth
              onClick={loginClick}
              disabled={instanceBase.length === 0 || username.length === 0 || password.length === 0}
              loading={isLoading}
            >
              Login
            </Button>

            <Box
              sx={{
                pt: 1,
              }}
            >
              <Tooltip title="Your session will be saved locally" placement="bottom">
                <Checkbox
                  label="Save Session"
                  variant="outlined"
                  checked={saveSession}
                  onChange={() => setSaveSession(!saveSession)}
                />
              </Tooltip>
            </Box>
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
                const jwt = jwt_decode(user.jwt, { complete: true });

                return (
                  <ListItem
                    key={index}
                    disabled={isLoading}
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
                      disabled={isLoading}
                      onClick={async () => {
                        setIsLoading(true);

                        try {
                          const lemmyClient = new LemmyHttp(`https://${user.base}`);

                          const getSite = await lemmyClient.getSite({
                            auth: user.jwt,
                          });

                          if (!getSite.my_user) {
                            // set instance base to the current instance
                            setInstanceBase(user.base);
                            setUsername(user.site.my_user.local_user_view?.person.name);

                            throw new Error("jwt does not provide auth, re-authenticate");
                          }

                          // if (saveSession) {
                          //   dispatch(addUser(user.base, auth.jwt, getSite));
                          // } else {
                          // dispatch(setCurrentUser(user.base, auth.jwt, getSite));
                          dispatch(setCurrentUser(user.base, user.jwt, getSite));
                          // }
                        } catch (e) {
                          setLoginError(typeof e == "string" ? e : e.message);
                        } finally {
                          setIsLoading(false);
                        }

                        // if (!expired) {

                        // dispatch(setCurrentUser(user.base, user.jwt, user.site));
                        // } else {
                        //   // set the form values
                        //   setInstanceBase(jwt.iss);
                        //   setUsername(user.site.my_user?.local_user_view?.person.name);
                        //   setPassword("");
                        // }
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
                        {user.site.my_user?.local_user_view?.person.name}@{user.base}
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
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Card>
        )}

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
            <Button size="sm" fullWidth color="warning" onClick={() => clearData(true)} disabled={isLoading}>
              Clean storage (keep users)
            </Button>

            <Button size="sm" fullWidth color="danger" onClick={() => clearData(false)} disabled={isLoading}>
              Purge storage
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
}
