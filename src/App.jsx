import React from "react";
import { Provider, useSelector } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { Routes, Route, Navigate } from "react-router-dom";
import { HashRouter } from "react-router-dom";

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";

import SiteHeader from "./components/SiteHeader";

import Approvals from "./pages/Approvals";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

import AppStore from "./store";

function PageRouter() {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);
  const isInElectron = useSelector((state) => state.configReducer.isInElectron);

  // when we get a jwt, set the cookie in electron
  React.useEffect(() => {
    if (currentUser && isInElectron) {
      window.modder.setLemmyCookie(currentUser.base, currentUser.jwt);
    }
  }, [currentUser]);

  if (!currentUser) return <Login />;

  return (
    <Container
      maxWidth={false}
      disableGutters={true}
      sx={{
        height: "100%",
        width: "100%",
        position: "absolute",
        bottom: 0,
        top: 0,
        left: 0,
        right: 0,
        display: "block",
        overflow: "hidden",
      }}
    >
      <HashRouter>
        <SiteHeader height="50px" />

        <Box
          sx={{
            height: "100%",
          }}
        >
          <Routes>
            <Route
              path="/"
              element={
                <Box
                  sx={{
                    overflow: "auto",
                    height: "calc(100% - 50px)",
                    width: "100%",
                  }}
                >
                  <Container
                    maxWidth={"md"}
                    sx={{
                      py: 2,
                    }}
                  >
                    <Reports />
                  </Container>
                </Box>
              }
            />
            <Route
              path="/approvals"
              element={
                <Box
                  sx={{
                    overflow: "auto",
                    height: "calc(100% - 50px)",
                    width: "100%",
                  }}
                >
                  <Container
                    maxWidth={"md"}
                    sx={{
                      py: 2,
                    }}
                  >
                    <Approvals />
                  </Container>
                </Box>
              }
            />
          </Routes>
        </Box>
      </HashRouter>
    </Container>
  );
}

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <Provider store={AppStore}>
        <PageRouter />
      </Provider>
    </QueryClientProvider>
  );
}
