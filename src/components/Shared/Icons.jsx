import React from "react";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

// content icons
import ForumIcon from "@mui/icons-material/Forum";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";

// approval icons
import HelpIcon from "@mui/icons-material/Help";

export const RoleIcons = {
  user: (...props) => <AccountBoxIcon {...props} />,
  mod: (...props) => <SupervisedUserCircleIcon {...props} />,
  admin: (...props) => <VerifiedUserIcon {...props} />,
};

export const ContentIcons = {
  post: (...props) => <ForumIcon {...props} />,
  comment: (...props) => <FormatQuoteIcon {...props} />,
  pm: (...props) => <ForumIcon {...props} />,
  approval: (...props) => <HelpIcon {...props} />,
};
