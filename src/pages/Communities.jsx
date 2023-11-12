import React, { useEffect } from "react";

import { useSelector } from "react-redux";
import { useInView } from "react-intersection-observer";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Sheet from "@mui/joy/Sheet";
import CircularProgress from "@mui/joy/CircularProgress";
import AccordionGroup from "@mui/joy/AccordionGroup";
import { accordionSummaryClasses } from "@mui/joy/AccordionSummary";
import Checkbox from "@mui/joy/Checkbox";

import { FilterModLogType, FilterUserAutocomplete, FilterCommunityAutocomplete } from "../components/Filters";

import useLemmyInfinite from "../hooks/useLemmyInfinite";
import { getSiteData } from "../hooks/getSiteData";

import { parseActorId } from "../utils";

import ModLogAccordians from "../components/Activity/ModLogAccordians";
import { selectModLogType } from "../redux/reducer/configReducer";
import { useSearchParams } from "react-router-dom";

/**
 *
 * if the user is an admin, we need to show a search and then have an infintie list of the results (or just paginated comunities)
 * if the user is only a mod of certain communities, we gotta show a list of those.
 *
 *
 * for each communtity, we should show a overview pane that can be expanded to show moderator list and latest actions in that community
 * when it's expnaded, we can ad-hoc: ban user by search, promote to mod by search
 * we can also see list of existing mods, and their activity in the community
 */

export default function Communities() {
  const { baseUrl, siteData, localPerson, userRole } = getSiteData();
  const [searchParams, setSearchParams] = useSearchParams();

  const locaUserParsedActor = parseActorId(localPerson.actor_id);

  const modLogType = useSelector(selectModLogType);

  const [limitLocalInstance, setLimitLocalInstance] = React.useState(true);
  const [limitCommunityId, setLimitCommunityId] = React.useState(null);
  const [limitModId, setLimitModId] = React.useState(null);
  const [actedOnId, setActedOnID] = React.useState(null);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      test
    </Box>
  );
}
