export function getUserRole(currentUser) {
  if (!currentUser) return null;

  // is admin
  if (currentUser.site.my_user.local_user_view.person.admin) return "admin";

  // is mod
  if (currentUser.site.my_user.moderates.length > 0) return "mod";

  return "user";
}
// given a Lemmy actor_id, determine the type, user and base url of the actor
// https://lemmy.tgxn.net/u/tgxn
// https://lemmy.tgxn.net/c/lemmy

export function parseActorId(actorId) {
  // console.log("actorId", actorId);

  const actorBaseUrl = actorId.split("/")[2];
  const actorType = actorId.split("/")[3];
  const actorName = actorId.split("/")[4];

  return {
    actorType,
    actorName,
    actorBaseUrl,
  };
}

export function getModLogTypeNames() {
  {
    /* "all" | "removed_posts" | "locked_posts" | "featured_posts" | "removed_comments" |
     "removed_communities" | "banned_from_community" | "added_to_community" | "transferred_to_community" 
     | "added" | "banned" | "ModHideCommunity" | "admin_purged_persons" | "admin_purged_communities" | 
     "admin_purged_posts" | "admin_purged_comments" 
     
    TODO ModHideCommunity doesn't seem used?
     */
  }

  return {
    all: "All",
    removed_posts: "Removing Posts",
    locked_posts: "Locking Posts",
    featured_posts: "Featuring Posts",
    removed_comments: "Removing Comments",
    removed_communities: "Removing Communities",
    banned_from_community: "Banning From Communities",
    added_to_community: "Adding Mod to Community",
    transferred_to_community: "Transferring Communities",

    added: "Site Admin Changes", // promote site admin

    banned: "Site Bans", // ban user from site

    // ModHideCommunity: "Mod Hide Community", // TODO doesn't seem used?

    admin_purged_persons: "Admin Purge Person",
    admin_purged_communities: "Admin Purge Community",
    admin_purged_posts: "Admin Purge Post",
    admin_purged_comments: "Admin Purge Comment",
  };
}
