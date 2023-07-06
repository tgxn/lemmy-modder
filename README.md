# mod lemmy ayyy

I'm thinking of building a quick and dirty electron app that can:
- integrate wiht lemmy api, get list of my modded communtiies
- dropdown "select communtiy" or "all"
- show a list of reports in specifc communities
- clear "take actions" buttons on each report
 - remove post
 - purge post
 - ignore report
- option to remove "ignore" reports that we dont wanna action



thinking methods

 - browser plugins - too much work/hard to manage thru ui upgrades/will break
 - website  - suffers issues with cors logins, could be possible in future
 - local app - can work currently, doesn't rely on server owners to install/update
 - backend container sits with lemmy instance - overhead to manage for admins, possibly better access to data from db


# backend

