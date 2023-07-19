[![publish-pages](https://github.com/tgxn/lemmy-modder/actions/workflows/publish-pages.yaml/badge.svg)](https://github.com/tgxn/lemmy-modder/actions/workflows/publish-pages.yaml)

# Lemmy Modder

A Lemmy moderation tool for community moderators and site admins. Like the reports page, but on steroids. ⚡

Now available at https://modder.lemmyverse.net/ which should work for sites that have `CORS *`

## Features:
- Quick Actions 
    - Resolve/Unresolve Reports
    - Remove/Restore Posts & Comments
    - Ban/Unban Users (from Community or Site)
    - Lock/Unlock Posts

- Quick Switch Accounts
- Lemmy Instance Auto-Login in popups
- Auto-Update from GitHub


## Screenshots
| | | |
| --- | --- | --- |
| ![Login Screen](./docs/image/032/login.png) | ![Clean Screen](./docs/image/032/clean.png)   | ![Busy Screen](./docs/image/032/busy.png) |


You can use the portable version or the installer which can auto-update from GitHub. Check the latest release for the files.

## Dev Running

1. Frontend: `cd frontend && npm i && npm start`
2. App: `cd app && npm i && npm start`


# todo implement

 > ticked when i added the button functionality :)

# "resolve"/"unresolve" reports
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#resolvePostReport
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#resolveCommentReport
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#resolvePrivateMessageReport

# delete content
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#removePost
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#removeComment


# purge content
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#purgePost
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#purgeComment
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#purgePerson

# get / ban users
- https://join-lemmy.org/api/classes/LemmyHttp.html#getBannedPersons
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#banFromCommunity
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#banPerson

# lock / comment / distinguish
- https://join-lemmy.org/api/classes/LemmyHttp.html#lockPost
- https://join-lemmy.org/api/classes/LemmyHttp.html#createComment
- https://join-lemmy.org/api/classes/LemmyHttp.html#distinguishComment

# manage community mods
- https://join-lemmy.org/api/classes/LemmyHttp.html#addModToCommunity
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#getUnreadRegistrationApplicationCount
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#listRegistrationApplications
- ✅ https://join-lemmy.org/api/classes/LemmyHttp.html#approveRegistrationApplication

- https://join-lemmy.org/api/classes/LemmyHttp.html#getModlog


# Credits

Logo made by Andy Cuccaro (@andycuccaro) under the CC-BY-SA 4.0 license.

