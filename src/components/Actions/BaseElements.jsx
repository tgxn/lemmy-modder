import React from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import Tooltip from "@mui/joy/Tooltip";
import Divider from "@mui/joy/Divider";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Checkbox from "@mui/joy/Checkbox";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

import WarningRoundedIcon from "@mui/icons-material/WarningRounded";

import useLemmyReports from "../../hooks/useLemmyReports";

import { BasicInfoTooltip } from "../Tooltip.jsx";

export const BaseActionButton = ({
  // icon = null,
  size = "small",
  text,
  tooltip,
  color = "neutral",
  variant = "outlined",
  ...props
}) => {
  // const { isFetching } = useLemmyReports();

  return (
    <BasicInfoTooltip
      title={tooltip}
      color={color}
      variant="outlined" // tooltip variant is static
      placement="bottom"
      arrow
      disableInteractive
    >
      <Button
        variant={variant}
        color={color}
        size={size}
        // disabled={isFetching}
        sx={{
          userSelect: "none",
          // borderRadius: 4,
          p: 1,
          // px: 0.8,
          // height: "28px",
        }}
        {...props}
      >
        {text}
      </Button>
    </BasicInfoTooltip>
  );
};

export const ActionConfirmButton = ({
  size = "md",
  variant = "outlined",

  baseText,
  confirmText,

  baseTooltip,
  confirmTooltip,

  baseColor = "neutral",
  confirmColor = "danger",

  // confirmVariant = "solid",

  loading = false,
  onConfirm,
  ...props
}) => {
  const [isConfirming, setIsConfirming] = React.useState(false);

  let finalColor = !isConfirming ? baseColor : confirmColor;
  if (loading) {
    finalColor = "neutral";
  }

  return (
    <BaseActionButton
      size={size}
      variant={variant}
      color={finalColor}
      text={!isConfirming ? baseText : confirmText}
      tooltip={!isConfirming ? baseTooltip : confirmTooltip}
      onMouseLeave={() => setIsConfirming(false)}
      onClick={() => {
        if (isConfirming) {
          onConfirm();
          setIsConfirming(false);
        } else {
          setIsConfirming(true);
        }
      }}
      sx={{
        ml: 1, // this is needed for the thumb icon
      }}
      loading={loading}
      {...props}
    />
  );
};

export const InputElement = ({ value, setValue, inputText, placeholder = "" }) => {
  return (
    <FormControl
      sx={{
        py: 0.5,
      }}
    >
      {inputText && <FormLabel>{inputText}</FormLabel>}
      <Input
        autoFocus
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
    </FormControl>
  );
};

export const CheckboxElement = ({ value, setValue, inputText }) => {
  return (
    <FormControl
      sx={{
        py: 1,
        px: 1,
      }}
    >
      <Checkbox label={inputText} variant="outlined" checked={value} onChange={() => setValue(!value)} />
    </FormControl>
  );
};

export const ExpiryLengthElement = ({ value, setValue, inputText }) => {
  const onChange = (e, newValue) => {
    setValue(newValue);
  };
  return (
    <FormControl
      sx={{
        py: 0.5,
      }}
    >
      {inputText && <FormLabel>{inputText}</FormLabel>}
      <Select defaultValue={value} onChange={onChange}>
        <Option value="no_expiry">No Expiry</Option>
        <Option value="one_day">One Day</Option>
        <Option value="one_week">One Week</Option>
        <Option value="one_month">One Month</Option>
        <Option value="one_year">One Year</Option>
      </Select>
    </FormControl>
  );
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  buttonMessage,
  color = "danger",

  extraElements = [],

  disabled = false,

  loading,
  error,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal open={open} onClose={() => onCancel()}>
      <ModalDialog
        variant="outlined"
        role="alertdialog"
        aria-labelledby="alert-dialog-modal-title"
        aria-describedby="alert-dialog-modal-description"
      >
        <Typography id="alert-dialog-modal-title" component="h2" startDecorator={<WarningRoundedIcon />}>
          {title}
        </Typography>
        <Divider />
        <Typography id="alert-dialog-modal-description" textColor="text.tertiary">
          {message}
        </Typography>

        {extraElements.length > 0 && extraElements}

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 2 }}>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => {
              onCancel();
            }}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            color={color}
            loading={loading}
            disabled={loading || disabled}
            onClick={() => {
              onConfirm();
            }}
          >
            {buttonMessage}
          </Button>
        </Box>
        {error && (
          <Typography
            component="div"
            sx={{
              textAlign: "right",
              mt: 1,
              color: "#ff0000",
            }}
          >
            {typeof error === "string" ? error : error.message}
          </Typography>
        )}
      </ModalDialog>
    </Modal>
  );
};
