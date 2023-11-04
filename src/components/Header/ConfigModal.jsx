import * as React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import Switch from "@mui/joy/Switch";
import Grid from "@mui/joy/Grid";

import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator, { listItemDecoratorClasses } from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemButton from "@mui/joy/ListItemButton";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import InboxIcon from "@mui/icons-material/Inbox";
import Label from "@mui/icons-material/Label";
import People from "@mui/icons-material/People";
import Info from "@mui/icons-material/Info";
import Star from "@mui/icons-material/Star";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

export default function ConfigModal({ open, onClose }) {
  // Settings

  /**
   * - Blur NSFW Previews?
   * - Media Click Action: Popup, Spotlight
   * - Show Full instance for remote users?
   * - Show Avatars?
   * -
   *
   */

  const [blurNSFW, setBlurNSFW] = React.useState(true);

  // open = true;

  return (
    <Modal open={open} onClose={onClose}>
      <ModalDialog
        aria-labelledby="nested-modal-title"
        aria-describedby="nested-modal-description"
        sx={(theme) => ({
          [theme.breakpoints.only("xs")]: {
            top: "unset",
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 0,
            transform: "none",
            maxWidth: "unset",
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          {/** right side settings */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
            }}
          >
            {/* // config/sdettings */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{
                  mr: 1,
                }}
              >
                Blur NSFW?
              </Typography>
              <Switch
                checked={blurNSFW}
                onChange={(e) => {
                  setBlurNSFW(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <Typography
                sx={{
                  mr: 1,
                }}
              >
                Show Avatars?
              </Typography>
              <Switch
                checked={blurNSFW}
                onChange={(e) => {
                  setBlurNSFW(e.target.checked);
                }}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 1,
            display: "flex",
            gap: 1,
            flexDirection: { xs: "column", sm: "row-reverse" },
          }}
        >
          <Button variant="solid" color="primary" onClick={onClose}>
            Save
          </Button>
          <Button variant="outlined" color="neutral" onClick={onClose}>
            Cancel
          </Button>
        </Box>
      </ModalDialog>
    </Modal>
  );
}
