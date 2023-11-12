import React from "react";

import Box from "@mui/joy/Box";
import Sheet from "@mui/joy/Sheet";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Typography from "@mui/joy/Typography";
import Stack from "@mui/joy/Stack";

import { getSiteData } from "../hooks/getSiteData";

import { useLemmyHttp } from "../hooks/useLemmyHttp.js";

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

function CommunityCard({ community, moderator }) {
  console.log("community", community, moderator);

  // need to lookup communit  y info on load

  const {
    isLoading: communityDataIsLoading,
    isFetching: communityDataIsFetching,
    error: communityDataError,
    data: rawCommunityData,
  } = useLemmyHttp("getCommunity", { id: community.id });

  const communityData = React.useMemo(() => {
    if (!rawCommunityData) return null;

    return rawCommunityData.community_view;
  }, [rawCommunityData]);

  const moderatorList = React.useMemo(() => {
    if (!rawCommunityData) return null;

    return rawCommunityData.moderators;
  }, [rawCommunityData]);

  if (communityDataIsLoading || communityDataIsFetching)
    return (
      <Card variant={"plain"} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4">Loading...</Typography>
      </Card>
    );

  return (
    <Card
      variant={"plain"}
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "row",
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4">{community.name}</Typography>
        <Typography variant="h5">{community.title}</Typography>
      </Box>
      <Typography variant="body1">{community.description}</Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {moderatorList &&
          moderatorList.map((mod) => {
            console.log("mod", mod);
            return (
              <Typography variant="body1">
                {mod.moderator.name} ({mod.moderator.display_name})
              </Typography>
            );
          })}
      </Box>

      {/* 
      <pre>{JSON.stringify(moderator, null, 2)}</pre>

      <pre>{JSON.stringify(community, null, 2)}</pre>
      <pre>{JSON.stringify(communityData, null, 2)}</pre> */}
    </Card>
  );
}

export default function Communities() {
  const { baseUrl, siteData, localPerson, modCommms, userRole } = getSiteData();
  // const [searchParams, setSearchParams] = useSearchParams();

  // const locaUserParsedActor = parseActorId(localPerson.actor_id);

  // const modLogType = useSelector(selectModLogType);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {modCommms.map((community) => {
        return <CommunityCard community={community.community} moderator={community.moderator} />;
      })}
    </Box>
  );
}
