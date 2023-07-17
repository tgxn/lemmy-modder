import React from "react";
import { Provider, useSelector } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// import { Routes, Route, Navigate } from "react-router-dom";
// import { HashRouter } from "react-router-dom";

import Container from "@mui/joy/Container";

import SiteHeader from "./components/SiteHeader";

import Reports from "./pages/Reports";
import Login from "./pages/Login";

import AppStore from "./store";

function PageRouter({ children }) {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);

  // when we get a jwt, set the cookie in electron
  React.useEffect(() => {
    if (currentUser) {
      window.modder.setLemmyCookie(currentUser.base, currentUser.jwt);
    }
  }, [currentUser]);

  if (!currentUser) return <Login />;

  return (
    <React.Fragment>
      <SiteHeader />

      <Container
        maxWidth={"md"}
        sx={{
          py: 2,
        }}
      >
        <Reports />
      </Container>
    </React.Fragment>
  );
}

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <Provider store={AppStore}>
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
          }}
        >
          <PageRouter />
          {/* 
          {!currentUser && <Login />}
          {currentUser && (
            <PageWrapper>
              <Main />
            </PageWrapper>
          )} */}

          {/* <HashRouter>
            <Box
              sx={
                {
                  // height: "calc(100% - 80px)",
                }
              }
            >
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/login" element={<LoginForm />} />
              </Routes>
            </Box>
          </HashRouter> */}
        </Container>
      </Provider>
    </QueryClientProvider>
  );
}
