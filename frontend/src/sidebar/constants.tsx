import HelpIcon from '@mui/icons-material/Help';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

export const SIDEBAR_ITEMS = [
    {
        title: 'Q&A',
        link: '/questions',
        icon: <HelpIcon/>
    },
    {
        title: 'Writing',
        link: '/writing',
        icon: <AssignmentIcon/>
    },
    {
        title: 'Summarize',
        link: '/summarize',
        icon: <SummarizeIcon/>
    },
    {
        title: 'Grammar',
        link: '/grammar',
        icon: <FactCheckIcon/>
    }
];

export const SIDEBAR_FOOTER_ITEMS = [
    {
        title: 'Profile',
        link: '/profile',
        icon: <AccountCircleIcon/>
    },
    {
        title: 'Logout',
        link: '/logout',
        icon: <LogoutIcon/>
    }
];