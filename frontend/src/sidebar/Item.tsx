import { useRouter } from 'next/router';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

type ItemProps = {
    title: string,
    link: string,
    icon: React.ReactNode
    disablePadding?: boolean,
    highlighted?: boolean,
}

export default function Item({ title, link, icon, disablePadding=false, highlighted=false } : ItemProps) {
    const router = useRouter();

    const handleClick = () => {
        if (router.isReady) router.push(link);
    }

    return (
        <ListItem disablePadding={disablePadding}>
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={title} sx={{ color: highlighted ? 'primary.main' : 'inherit' }}/>
            </ListItemButton>
        </ListItem>
    )
};