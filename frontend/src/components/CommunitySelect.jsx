import React from "react";

import { useQueryClient } from "@tanstack/react-query";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import IconButton from "@mui/joy/IconButton";
import CachedIcon from "@mui/icons-material/Cached";

import Chip from "@mui/joy/Chip";

import { setSelectedCommunity } from "../reducers/configReducer";

import { getSiteData } from "../hooks/getSiteData";

export default function CommunitySelect() {
  const dispatch = useDispatch();
  const selectedCommunity = useSelector((state) => state.configReducer.selectedCommunity);

  const queryClient = useQueryClient();

  const { modCommms } = getSiteData();

  return (
    <Box>
      {/* Community Select */}
      {modCommms && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <IconButton
            variant="outlined"
            color="neutral"
            onClick={() => {
              // invalidate everything
              queryClient.invalidateQueries({ queryKey: ["lemmyHttp"] });
            }}
          >
            <CachedIcon />
          </IconButton>
          <Select
            defaultValue={selectedCommunity}
            value={selectedCommunity}
            onChange={(event, newValue) => {
              dispatch(setSelectedCommunity(newValue));
            }}
            sx={{
              flewxGrow: 1,
              width: "100%",
            }}
            slotProps={{
              listbox: {
                component: "div",
                sx: {
                  maxHeight: 240,
                  overflow: "auto",
                  "--List-padding": "0px",
                  "--ListItem-radius": "0px",
                },
              },
            }}
          >
            <Option key="all" value="all">
              All Communities
            </Option>
            {modCommms.map((community) => {
              const { name, title } = community.community;
              console.log("community", community.community.name);
              return (
                <Option
                  key={name}
                  value={name}
                  label={
                    <React.Fragment>
                      <Chip size="sm" color={"primary"} sx={{ borderRadius: "xs", mr: 1 }}>
                        Community
                      </Chip>
                      {title}
                    </React.Fragment>
                  }
                >
                  {title}
                </Option>
              );
            })}
          </Select>
        </Box>
      )}
    </Box>
  );
}
