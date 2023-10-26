import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";

import Chip from "@mui/joy/Chip";

import { selectFilterType, selectHideReadApprovals, selectModLogType, selectShowRemoved, selectShowResolved, setConfigItem } from "../reducers/configReducer";

import { getSiteData } from "../hooks/getSiteData";
import { getModLogTypeNames } from "../utils";

export function FilterCommunity() {
  const dispatch = useDispatch();
  const filterCommunity = useSelector(selectFilterCommunity);

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
              Show Everything
            </Option>
            {modCommms.map((community) => {
              const { name, title } = community.community;
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

export function FilterTypeSelect() {
  const dispatch = useDispatch();
  const filterType = useSelector(selectFilterType);

  return (
    <Select
      defaultValue={filterType}
      color="neutral"
      variant="outlined"
      onChange={(e, newValue) => {
        dispatch(setConfigItem("filterType", newValue));
      }}
      sx={{
        minWidth: 150,
      }}
    >
      <Option key={"post"} value={"all"} label={"All"} color="neutral">
        <Typography component="span">All</Typography>
      </Option>

      <Option key={"posts"} value={"posts"} label={"Posts"} color="neutral">
        <Typography component="span">Posts</Typography>
      </Option>

      <Option key={"comments"} value={"comments"} label={"Comments"} color="neutral">
        <Typography component="span">Comments</Typography>
      </Option>

      <Option key={"pms"} value={"pms"} label={"PMs"} color="neutral">
        <Typography component="span">PMs</Typography>
      </Option>
    </Select>
  );
}

export function FilterModLogType() {
  const dispatch = useDispatch();
  const modLogType = useSelector(selectModLogType);

  const modlogTypes = getModLogTypeNames();

  return (
    <Select
      defaultValue={modLogType}
      color="neutral"
      variant="outlined"
      onChange={(e, newValue) => {
        dispatch(setConfigItem("modLogType", newValue));
      }}
      sx={{
        minWidth: 150,
      }}
    >
      {Object.entries(modlogTypes).map(([key, type]) => {
        return (
          <Option key={key} value={key} label={type} color="neutral">
            <Typography component="span">{type}</Typography>
          </Option>
        );
      })}
    </Select>
  );
}

export function FilterResolved() {
  const dispatch = useDispatch();
  const showResolved = useSelector(selectShowResolved);

  return (
    <Checkbox
      label="Show Resolved"
      variant="outlined"
      checked={showResolved}
      onChange={() => {
        dispatch(setConfigItem("showResolved", !showResolved));
      }}
    />
  );
}

export function HideRead() {
  const dispatch = useDispatch();
  const hideReadApprovals = useSelector(selectHideReadApprovals);

  return (
    <Checkbox
      label="Hide Read"
      variant="outlined"
      checked={hideReadApprovals}
      onChange={() => {
        dispatch(setConfigItem("hideReadApprovals", !hideReadApprovals));
      }}
    />
  );
}

export function FilterRemoved() {
  const dispatch = useDispatch();
  const showRemoved = useSelector(selectShowRemoved);

  return (
    <Checkbox
      label="Show Removed/Deleted"
      variant="outlined"
      checked={showRemoved}
      onChange={() => {
        dispatch(setConfigItem("showRemoved", !showRemoved));
      }}
    />
  );
}
