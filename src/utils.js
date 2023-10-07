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
  return {
    All: "All",
    ModRemovePost: "Removing Posts",
    ModLockPost: "Locking Posts",
    ModFeaturePost: "Featuring Posts",
    ModRemoveComment: "Removing Comments",
    ModRemoveCommunity: "Removing Communities",
    ModBanFromCommunity: "Banning From Communities",
    ModAddCommunity: "Adding Mod to Community",
    ModTransferCommunity: "Transferring Communities",

    ModAdd: "Adding Mod to Site",

    ModBan: "Mod Ban",
    ModHideCommunity: "Mod Hide Community",
    AdminPurgePerson: "Admin Purge Person",
    AdminPurgeCommunity: "Admin Purge Community",
    AdminPurgePost: "Admin Purge Post",
    AdminPurgeComment: "Admin Purge Comment",
  };
}
