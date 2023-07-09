import React from "react";

import { useSelector } from "react-redux";

import Container from "@mui/joy/Container";

import LoginForm from "../components/LoginForm";

import SiteHeader from "../components/SiteHeader";
import CommunitySelect from "../components/CommunitySelect";
import ReportsList from "../components/ReportsList";

export default function MainPage() {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);

  // when we get a jwt, set the cookie in electron
  React.useEffect(() => {
    if (currentUser) {
      window.modder.setLemmyCookie(currentUser.base, currentUser.jwt);
    }
  }, [currentUser]);

  // return login form if no jwt
  if (!currentUser) {
    return <LoginForm />;
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
