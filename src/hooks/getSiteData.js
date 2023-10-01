import { useMemo } from "react";

import { useSelector } from "react-redux";

// accessor for the site data returned at the time of login
export function getSiteData() {
  const currentUser = useSelector((state) => state.accountReducer.currentUser);

  const modCommms = useMemo(() => {
    if (!currentUser) return [];

    return currentUser.site.my_user.moderates;
  }, [currentUser]);

  const localUserView = useMemo(() => {
    if (!currentUser) return null;

    return currentUser.site.my_user.local_user_view;
  }, [currentUser]);

  const userRole = useMemo(() => {
    if (!currentUser) return null;

    // is admin
    if (currentUser.site.my_user.local_user_view.person.admin) return "admin";

    // is mod
    if (currentUser.site.my_user.moderates.length > 0) return "mod";

    return "user";
  }, [currentUser]);

  return {
    baseUrl: currentUser?.base,

    siteData: currentUser.site.site_view.site,

    userRole: userRole,
    modCommms: modCommms,

    localUser: localUserView?.local_user,
    localPerson: localUserView?.person,
  };
}
