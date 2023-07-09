import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import Chip from "@mui/joy/Chip";

import { setConfigItem } from "../reducers/configReducer";

import { getSiteData } from "../hooks/getSiteData";

export default function CommunitySelect() {
  const dispatch = useDispatch();
  const filterCommunity = useSelector((state) => state.configReducer.filterCommunity);

  const { modCommms } = getSiteData();

  return (
    <Box>
      {modCommms && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
          }}
        >
          <Select
            defaultValue={filterCommunity}
            value={filterCommunity}
            onChange={(event, newValue) => {
              dispatch(setConfigItem("filterCommunity", newValue));
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
