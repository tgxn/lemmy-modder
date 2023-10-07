# account quick switching

the built-in account switcher uses your browser's `localStorage` to store your accounts, if you choose to save your session when logging in.

the stored data for each account consists of:
- the lemmy instance url
- your JWT token, that is retrieved on login
- the result of the siteData query (site name, username, etc)

we track the current active user via the local storage `currentUser`

