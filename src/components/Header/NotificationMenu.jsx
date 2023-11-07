import React from "react";

import { useNavigate, useLocation } from "react-router-dom";

import { Popper } from "@mui/base/Popper";
import { styled } from "@mui/joy/styles";

import { ClickAwayListener } from "@mui/base/ClickAwayListener";

import IconButton from "@mui/joy/IconButton";
import Badge from "@mui/joy/Badge";
import Tabs from "@mui/joy/Tabs";
import TabList from "@mui/joy/TabList";
import Tab, { tabClasses } from "@mui/joy/Tab";
import TabPanel from "@mui/joy/TabPanel";
import Divider from "@mui/joy/Divider";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { useLemmyHttp } from "../../hooks/useLemmyHttp";
import { getSiteData } from "../../hooks/getSiteData";

import { BasicInfoTooltip } from "../Tooltip.jsx";

const Popup = styled(Popper)({
  zIndex: 1000,
  borderRadius: 4,
});

import { MessagesTab, RepliesTab, MentionsTab } from "./NotificationMenuTabs";

export default function NotificationMenu() {
  const {
    isLoading: unreadCountLoading,
    isFetching: unreadCountFetching,
    error: unreadCountError,
    data: unreadCountData,
  } = useLemmyHttp("getUnreadCount");

  const headerUnreadCount = React.useMemo(() => {
    if (!unreadCountData) return null;

    console.log("unreadCountData", unreadCountData);
    return unreadCountData.replies + unreadCountData.mentions + unreadCountData.private_messages;
  }, [unreadCountData]);

  const buttonRef = React.useRef(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Badge
        invisible={headerUnreadCount == 0}
        size="sm"
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        color="danger"
      >
        <BasicInfoTooltip
          title={`Notifications (${headerUnreadCount} unread)`}
          placement="bottom"
          variant="soft"
        >
          <IconButton
            ref={buttonRef}
            id="composition-button"
            aria-controls={"composition-menu"}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            size="sm"
            variant={open ? "soft" : "outlined"}
            color={open ? "primary" : "neutral"}
            onClick={() => {
              setOpen(!open);
            }}
            sx={{
              mr: 1,
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NotificationsIcon />
          </IconButton>
        </BasicInfoTooltip>
      </Badge>

      <Popup
        role={undefined}
        id="composition-menu"
        open={open}
        anchorEl={buttonRef.current}
        placement="bottom-end"
        // disablePortal
        // sx={{
        //   borderRadius: 4,
        // }}
        modifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 4],
            },
          },
        ]}
      >
        <ClickAwayListener
          onClickAway={(event) => {
            if (event.target !== buttonRef.current) {
              handleClose();
            }
          }}
        >
          <Tabs
            variant="outlined"
            aria-label="Pricing plan"
            defaultValue={0}
            sx={{
              width: 350,
              borderRadius: 4,
              boxShadow: "sm",
              // overflow: "visible",
            }}
          >
            <TabList
              disableUnderline
              tabFlex={1}
              sx={{
                [`& .${tabClasses.root}`]: {
                  fontSize: "sm",
                  fontWeight: "lg",
                  [`&[aria-selected="true"]`]: {
                    color: "primary.500",
                    bgcolor: "background.surface",
                  },
                  [`&.${tabClasses.focusVisible}`]: {
                    outlineOffset: "-4px",
                  },
                },
              }}
            >
              <Badge
                badgeContent={unreadCountData?.private_messages}
                invisible={unreadCountLoading || unreadCountData?.private_messages == 0}
                color="warning"
                sx={{ flexGrow: 1 }}
              >
                <Tab disableIndicator variant="soft">
                  Messages
                </Tab>
              </Badge>

              <Badge
                badgeContent={unreadCountData?.replies}
                invisible={unreadCountLoading || unreadCountData?.replies == 0}
                color="warning"
                sx={{ flexGrow: 1 }}
              >
                <Tab disableIndicator variant="soft">
                  Replies
                </Tab>
              </Badge>

              <Badge
                badgeContent={unreadCountData?.mentions}
                invisible={unreadCountLoading || unreadCountData?.mentions == 0}
                color="warning"
                sx={{ flexGrow: 1 }}
              >
                <Tab disableIndicator variant="soft">
                  Mentions
                </Tab>
              </Badge>
            </TabList>

            <Divider />

            <TabPanel value={0} sx={{ p: 0, maxHeight: "500px", overflowY: "auto" }}>
              <MessagesTab setOpen={setOpen} />
            </TabPanel>
            <TabPanel value={1} sx={{ p: 0, maxHeight: "500px", overflowY: "auto" }}>
              <RepliesTab setOpen={setOpen} />
            </TabPanel>
            <TabPanel value={2} sx={{ p: 0, maxHeight: "500px", overflowY: "auto" }}>
              <MentionsTab setOpen={setOpen} />
            </TabPanel>
          </Tabs>
        </ClickAwayListener>
      </Popup>
    </div>
  );
}
