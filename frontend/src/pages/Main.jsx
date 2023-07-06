import React from "react";
import { connect } from "react-redux";

import Container from "@mui/joy/Container";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";

import LoginForm from "../components/LoginForm";
import CommunitySelect from "../components/CommunitySelect";
import ReportsList from "../components/ReportsList";

function MainPage({ userJwt }) {
  // return login form if no jwt
  if (!userJwt) {
    return (
      <Container maxWidth={"md"} sx={{}}>
        <LoginForm />
      </Container>
    );
  }

  return (
    <Container
      maxWidth={"md"}
      sx={{
        py: 2,
      }}
    >
      <CommunitySelect />

      <ReportsList />
    </Container>
  );
}

const mapStateToProps = (state) => ({
  userJwt: state.configReducer.userJwt,
  instanceBase: state.configReducer.instanceBase,
});
export default connect(mapStateToProps)(MainPage);
