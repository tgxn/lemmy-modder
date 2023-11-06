import React from "react";

// user role icons
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import SupervisedUserCircleIcon from "@mui/icons-material/SupervisedUserCircle";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

export const RoleIcons = {
  user: (...props) => <AccountBoxIcon {...props} />,
  mod: (...props) => <SupervisedUserCircleIcon {...props} />,
  admin: (...props) => <VerifiedUserIcon {...props} />,

  UserIcon: AccountBoxIcon,
  ModIcon: SupervisedUserCircleIcon,
  AdminIcon: VerifiedUserIcon,
};

// content icons
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import ForumIcon from "@mui/icons-material/Forum";
import DraftsIcon from "@mui/icons-material/Drafts";

// approval icons
import HelpIcon from "@mui/icons-material/Help";

export const ContentIcons = {
  PostIcon: StickyNote2Icon,
  CommentIcon: ForumIcon,
  PMIcon: DraftsIcon,
  ApprovalIcon: HelpIcon,
};

// notification icons reply mention pm
import ReplyIcon from "@mui/icons-material/Reply";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";

export const NotificationIcons = {
  ReplyIcon,
  MentionIcon: ChatIcon,
  PMIcon: EmailIcon,
};
