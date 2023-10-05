
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