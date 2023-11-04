import React from "react";

import Typography from "@mui/joy/Typography";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import IconButton from "@mui/joy/IconButton";

import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import GitHubIcon from "@mui/icons-material/GitHub";
import SettingsIcon from "@mui/icons-material/Settings";
import { getSiteData } from "../../hooks/getSiteData";

import { BasicInfoTooltip } from "../Tooltip.jsx";

import ConfigModal from "./ConfigModal.jsx";

export default function CenterMenu() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();

  const [open, setOpen] = React.useState(false);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {siteData && (
        <BasicInfoTooltip title={"Open Lemmy Site (New Tab)"} placement="bottom" variant="soft">
          <Button
            size="sm"
            color={"primary"}
            variant={"solid"}
            onClick={() => {
              // navigate("/");
              // openw indow in new tab
              window.open(siteData.actor_id, "_blank");
            }}
            endDecorator={<OpenInNewIcon />}
            sx={{
              mr: 1,
              borderRadius: 4,
            }}
          >
            {siteData.name}
          </Button>
        </BasicInfoTooltip>
      )}
      <BasicInfoTooltip
        title={
          <Typography sx={{ textAlign: "center" }}>
            Code & Issues on GitHub <br />
            Version: {process.env.PACKAGE_VERSION}
          </Typography>
        }
        variant="outlined"
      >
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          sx={{ mr: 1 }}
          href="https://github.com/tgxn/lemmy-modder"
          target="_lm_github"
          component="a"
        >
          <GitHubIcon />
        </IconButton>
      </BasicInfoTooltip>
      <BasicInfoTooltip title={"Open Config"} variant="outlined">
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          // sx={{ mr: 2 }}
          // href="https://github.com/tgxn/lemmy-modder"
          // target="_lm_github"
          // component="a"
          onClick={() => setOpen(true)}
        >
          <SettingsIcon />
        </IconButton>
      </BasicInfoTooltip>
      <ConfigModal open={open} onClose={() => setOpen(false)} />
    </Box>
  );
}
