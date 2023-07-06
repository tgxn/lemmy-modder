import React from "react";

import { useSelector } from "react-redux";

import Container from "@mui/joy/Container";

import LoginForm from "../components/LoginForm";

import SiteHeader from "../components/SiteHeader";
import CommunitySelect from "../components/CommunitySelect";
import ReportsList from "../components/ReportsList";

export default function MainPage() {
  const instanceBase = useSelector((state) => state.configReducer.instanceBase);
  const userJwt = useSelector((state) => state.configReducer.userJwt);

  // when we get a jwt, set the cookie in electron
  React.useEffect(() => {
    if (userJwt) {
      window.modder.setLemmyCookie(instanceBase, userJwt);
    }
  }, [userJwt]);

  // return login form if no jwt
  if (!instanceBase || !userJwt) {
    return (
      <Container maxWidth={"md"} sx={{}}>
        <LoginForm />
      </Container>
    );
  }

  return (
    <React.Fragment>
      <SiteHeader />

      <Container
        maxWidth={"md"}
        sx={{
          py: 2,
        }}
      >
        <CommunitySelect />

        <ReportsList />
      </Container>
    </React.Fragment>
  );
}
