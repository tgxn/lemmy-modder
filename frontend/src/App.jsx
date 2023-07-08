import React from "react";
import { Provider } from "react-redux";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { Routes, Route, Navigate } from "react-router-dom";

import { HashRouter } from "react-router-dom";

import Box from "@mui/joy/Box";
import Container from "@mui/joy/Container";

import Main from "./pages/Main";

import AppStore from "./store";

const queryClient = new QueryClient();
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <LocalizationProvider dateAdapter={AdapterMoment}>
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
            <HashRouter>
              <Box
                sx={
                  {
                    // height: "calc(100% - 80px)",
                  }
                }
              >
                <Routes>
                  <Route path="/" element={<Main />} />
                </Routes>
              </Box>
            </HashRouter>
          </Container>
        </Provider>
      </LocalizationProvider>
    </QueryClientProvider>
  );
}
