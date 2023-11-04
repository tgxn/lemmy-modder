import * as React from "react";

import { useDispatch, useSelector } from "react-redux";

import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import FormHelperText from "@mui/joy/FormHelperText";
import TextField from "@mui/joy/TextField";
import Autocomplete from "@mui/joy/Autocomplete";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import Switch from "@mui/joy/Switch";
import DialogTitle from "@mui/joy/DialogTitle";
import ModalClose from "@mui/joy/ModalClose";
import Divider from "@mui/joy/Divider";

import {
  setConfigItem,
  setConfigItemJson,
  selectBlurNsfw,
  selectShowAvatars,
  selectNsfwWords,
} from "../../reducers/configReducer";

function BooleanSetting({ label, subtext, value, onChange }) {
  return (
    <FormControl orientation="horizontal" sx={{ width: 500, justifyContent: "space-between" }}>
      <div>
        <FormLabel>{label}</FormLabel>
        <FormHelperText sx={{ mt: 0 }}>{subtext}</FormHelperText>
      </div>
      <Switch
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
        color={value ? "success" : "neutral"}
        variant={value ? "solid" : "outlined"}
        endDecorator={value ? "On" : "Off"}
        slotProps={{
          endDecorator: {
            sx: {
              minWidth: 24,
            },
          },
        }}
      />
    </FormControl>
  );
}

function ArraySetting({ label, subtext, value, onChange }) {
  return (
    <FormControl
      orientation="horizontal"
      sx={{ width: 500, justifyContent: "space-between", flexDirection: "column" }}
      size="sm"
    >
      <div>
        <FormLabel>{label}</FormLabel>
        {/* <FormHelperText sx={{ mt: 0 }}>{subtext}</FormHelperText> */}
      </div>
      <Autocomplete
        freeSolo
        multiple
        size="sm"
        id="tags-default"
        autoComplete={false}
        openOnFocus={false}
        placeholder={subtext}
        options={[]}
        getOptionLabel={(option) => option}
        defaultValue={value}
        onChange={(e, newval, reason) => {
          console.log("onChange", newval, reason);
          onChange(newval);
        }}
      />
    </FormControl>
  );
}

export default function ConfigModal({ open, onClose }) {
  const blurNsfw = useSelector(selectBlurNsfw);
  const showAvatars = useSelector(selectShowAvatars);
  const nsfwWords = useSelector(selectNsfwWords);

  const dispatch = useDispatch();

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
        <ModalClose variant="plain" sx={{ m: 1 }} />
        <DialogTitle>User Configuration</DialogTitle>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            gap: 2,
            width: "500px",
          }}
        >
          <BooleanSetting
            label="Show Avatars?"
            subtext="should we display avatars for users?"
            value={showAvatars}
            onChange={(e) => dispatch(setConfigItem("showAvatars", e))}
          />
          <BooleanSetting
            label="Blur NSFW previews?"
            subtext="should posts with NSFW (or reports with words in the NSFW list) be blurred?"
            value={blurNsfw}
            onChange={(e) => dispatch(setConfigItem("blurNsfw", e))}
          />
          {blurNsfw && (
            <ArraySetting
              label="NSFW Words List"
              subtext="list of words to also mark as NSFW"
              value={nsfwWords}
              onChange={(e) => dispatch(setConfigItemJson("nsfwWords", e))}
            />
          )}
        </Box>
      </ModalDialog>
    </Modal>
  );
}
