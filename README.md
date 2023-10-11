[![publish-pages](https://github.com/tgxn/lemmy-modder/actions/workflows/publish-pages-main.yaml/badge.svg)](https://github.com/tgxn/lemmy-modder/actions/workflows/publish-pages-main.yaml)

# Lemmy Modder https://modder.lemmyverse.net/ 

⚡ A moderation tool for Lemmy community moderators and site admins. ⚡

 > Currently only compatible with 0.18.x instances _(and not 0.19.x)_, as the [Lemmy SDK is not backwards-compatible.](https://github.com/LemmyNet/lemmy-js-client/issues/194) ☹

## Screenshots
| | |
| --- | --- | 
| ![Login Screen](./docs/image/050/image-2.png) | ![Clean Screen](./docs/image/050/image.png)   |

## Features
- User Registration Approval
    - Improved user registrations approval panel
    - See more user data when making decision, join date, email, etc.
- Content Reports
    - Resolve/Unresolve Reports
    - Remove/Restore/Purge Posts & Comments
    - Ban/Unban Users (from Community or Site)
    - Lock/Unlock Posts
- View Mod Log
    - See all actions taken by mods on the instance
    - Filter by local instance actions
- Quick Switch Accounts on different Lemmy instances


## Hosting Options

To use Lemmy Modder - You can either:

1. Use the hosted version at https://modder.lemmyverse.net/ _(Production)_
2. Clone this repo and start your own instance alongside Lemmy  _(Production)_
3. Download the latest release and run it locally on your computer _(Development/Testing)_

### Running with Docker Compose

You will need:
- docker & docker-compose

1. Add this (service) to your docker-compose alongside the lemmy services, or wherever you like:
```yaml
## your networks and volumes from lemmy should stay here

services:
  ## your other lemmy services

  ## this is the lemmy modder container, you can change port 9696 to wehatever you like
  lemmy-modder:
    image: ghcr.io/tgxn/lemmy-modder:latest
    restart: unless-stopped
    ports:
      - 9696:80
```

2. Setup your reverse proxy to proxy requests for `modder.example.com` to the new container on port `80`.

_There are no more steps, as there is no users or databases._

### Running Locally

You will need:
- git
- nodejs & npm (use nvm to install `v18.17.0`)

1. Clone this repo `git clone https://github.com/tgxn/lemmy-modder.git`
2. Switch to the repo directory `cd lemmy-modder`
3. Install dependencies `npm i`
4. Start the dev server `npm start`

## Development

### Dev Running

1. Clone this repo `git clone https://github.com/tgxn/lemmy-modder.git`
2. Switch to the repo directory `cd lemmy-modder`
3. Install dependencies `npm i`
4. Start the dev server `npm start`


# Credits

Logo made by Andy Cuccaro (@andycuccaro) under the CC-BY-SA 4.0 license.

