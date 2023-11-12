import React from "react";

import Box from "@mui/joy/Box";
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

  // need to lookup community info on load

  const {
    isLoading: unreadCountLoading,
    isFetching: unreadCountFetching,
    error: unreadCountError,
    data: unreadCountData,
  } = useLemmyHttp("getCommunity", { id: community.id });

  return (
    <Card variant={"plain"}>
      <pre>{JSON.stringify(community, null, 2)}</pre>
      <pre>{JSON.stringify(unreadCountData, null, 2)}</pre>

      {/* <Stack spacing={2}>
        <Box>
          <Typography variant="h6">{community.name}</Typography>
          <Typography variant="body2">{community.description}</Typography>
        </Box>
        <Box>
          <Typography variant="body2">Moderators:</Typography>
          <Typography variant="body2">{community.moderators}</Typography>
        </Box>
        <Box>
          <Typography variant="body2">Latest actions:</Typography>
          <Typography variant="body2">{community.latestActions}</Typography>
        </Box>
      </Stack> */}
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
