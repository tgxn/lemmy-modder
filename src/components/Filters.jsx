import React from "react";

import { useDispatch, useSelector } from "react-redux";

import Box from "@mui/joy/Box";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import Typography from "@mui/joy/Typography";
import Checkbox from "@mui/joy/Checkbox";

import Chip from "@mui/joy/Chip";

import {
  selectFilterCommunity,
  selectFilterType,
  selectHideReadApprovals,
  selectModLogType,
  selectShowRemoved,
  selectShowResolved,
  setConfigItem,
} from "../redux/reducer/configReducer";

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

import { useLemmyHttpAction } from "../hooks/useLemmyHttp.js";

import Autocomplete from "@mui/joy/Autocomplete";
import CircularProgress from "@mui/joy/CircularProgress";
export function FilterUserAutocomplete({}) {
  const dispatch = useDispatch();

  // need to show an autocomplete, and then call the search api for results
  const { data, callAction, isSuccess, isLoading } = useLemmyHttpAction("search");

  const searchUsers = (searchTerm) => {
    console.log("searchUsers", searchTerm);

    if (searchTerm.length < 3) {
      return;
    }

    callAction({ q: searchTerm, listing_type: "Local", type_: "Users" });
  };

  const [open, setOpen] = React.useState(false);
  // const [options, setOptions] = React.useState([]);
  // const loading = open && options.length === 0;

  const options = React.useMemo(() => {
    if (isLoading) {
      return [];
    }

    console.log("options", data);

    if (data) {
      return data.users.map((user) => {
        return {
          id: user.person.id,
          title:
            user.person.display_name +
            " (" +
            user.person.name +
            "@" +
            user.person.actor_id.split("/")[2] +
            ")",
          person: user.person,
        };
      });
    }
    return [];
  }, [data]);

  // on close, clear options
  // React.useEffect(() => {
  //   if (!open) {
  //     setOptions([]);
  //   }
  // }, [open]);

  return (
    <Autocomplete
      sx={{ width: 300 }}
      placeholder="User Filter"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      isOptionEqualToValue={(option, value) => option.title === value.title}
      getOptionLabel={(option) => option.title}
      options={options}
      loading={isLoading}
      freeSolo={true}
      onInputChange={(e, newValue) => {
        searchUsers(newValue);
      }}
      endDecorator={isLoading ? <CircularProgress size="sm" sx={{ bgcolor: "background.surface" }} /> : null}
      // options={[]}
      // value={filterUser}
      // onChange={(e, newValue) => {
      //   dispatch(setConfigItem("filterUser", newValue));
      // }}
      // renderInput={(params) => <TextField {...params} label="Filter User" />}
    />
  );
}
