import React from "react";
// import { connect } from "react-redux";

// import useQueryCache from "../../hooks/useQueryCache";

import { FixedSizeList } from "react-window";

import { Popper } from "@mui/base/Popper";
import Autocomplete, { createFilterOptions } from "@mui/joy/Autocomplete";
import AutocompleteListbox from "@mui/joy/AutocompleteListbox";
import AutocompleteOption from "@mui/joy/AutocompleteOption";
import FormControl from "@mui/joy/FormControl";
import ListItemDecorator from "@mui/joy/ListItemDecorator";

import Add from "@mui/icons-material/Add";

// import { setHomeInstance } from "../../reducers/configReducer";

import useLVQueryCache from "../hooks/useLVQueryCache";
/**
 * This component renders a button that allows the user to select a home instance.
 *
 * It uses a react-window Virtualized List to render the list of instances.
 */

const filterOptions = createFilterOptions({
  //   matchFrom: "start",
  stringify: (option) => option.base,
  trim: true,
  ignoreCase: true,
});

const LISTBOX_PADDING = 6; // px

function renderRow(props) {
  const { data, index, style } = props;
  const dataSet = data[index];
  const inlineStyle = {
    ...style,
    top: style.top + LISTBOX_PADDING,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  };

  return (
    <AutocompleteOption key={dataSet[1].base} {...dataSet[0]} style={inlineStyle}>
      {dataSet[1].name?.startsWith('Add "') && (
        <ListItemDecorator>
          <Add />
        </ListItemDecorator>
      )}
      {typeof dataSet[1] == "string" && dataSet[1]}
      {dataSet[1].base && (
        <>
          {dataSet[1].name} ({dataSet[1].base})
        </>
      )}
    </AutocompleteOption>
  );
}

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return (
    <AutocompleteListbox
      {...props}
      {...outerProps}
      component="div"
      ref={ref}
      sx={{
        // zIndex: 1300,
        "& ul": {
          padding: 0,
          // zIndex: 1300,
          margin: 0,
          flexShrink: 0,
        },
      }}
    />
  );
});

// Adapter for react-window
const ListboxComponent = React.forwardRef(function ListboxComponent(props, ref) {
  const { children, anchorEl, open, modifiers, ...other } = props;
  const itemData = [];

  children[0].forEach((item) => {
    if (item) {
      itemData.push(item);
      itemData.push(...(item.children || []));
    }
  });

  const itemCount = itemData.length;
  const itemSize = 40;

  return (
    <Popper ref={ref} anchorEl={anchorEl} open={open} modifiers={modifiers} style={{ zIndex: 10000 }}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={itemSize * 8}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={itemSize}
          overscanCount={5}
          itemCount={itemCount}
          sx={(theme) => ({
            zIndex: theme.zIndex.modal + 1000,
          })}
        >
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </Popper>
  );
});

export default function InstanceSelect({
  placeholder,
  value,
  onChange,
  sx,
  variant,
  color,
  disabled,
  ...props
}) {
  const { isLoading, error, data } = useLVQueryCache("instanceMinData", "instance.min");

  const handleChange = (event, newValue) => {
    console.log("onChange", newValue);

    onChange(newValue ? newValue.base : "");
  };

  return (
    <Autocomplete
      sx={{ zIndex: 14000, ...sx }}
      value={value || ""}
      disabled={disabled}
      onChange={handleChange}
      selectOnFocus //to help the user clear the selected value.
      handleHomeEndKeys // to move focus inside the popup with the Home and End keys.
      freeSolo
      disableListWrap
      placeholder="Select Instance"
      slots={{
        listbox: ListboxComponent,
      }}
      options={data || []}
      loading={data == null}
      getOptionSelected={(option, value) => option.code === value.code}
      renderOption={(props, option) => [props, option]}
      // TODO: Post React 18 update - validate this conversion, look like a hidden bug
      // renderGroup={(params) => params}
      filterOptions={(options, params) => {
        const filtered = filterOptions(options, params);

        const { inputValue } = params;

        // Suggest the creation of a new value
        const isExisting = options.some((option) => inputValue === option.base);
        if (inputValue !== "" && !isExisting) {
          const cleanedUrl = inputValue
            .replace("http:", "")
            .replace("https:", "")
            .replace("//", "")
            .replace("/", "");
          filtered.push({
            name: `Other`,
            base: cleanedUrl,
          });
        }

        return filtered;
      }}
      getOptionLabel={(option) => {
        //   console.log("getOptionLabel", option);
        // Value selected with enter, right from the input
        if (typeof option === "string") {
          return option;
        }

        // Regular option
        return option.base;
      }}
    />
  );
}
