import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Item from './Item';
import { SIDEBAR_FOOTER_ITEMS } from './constants';

export default function Footer() {
	return (
		<Stack
			direction="column"
		>
			<Button variant="contained" size="large" style={{ margin: 15, padding: 15, marginBottom: 0 }}>Upgrade to Pro</Button>
			<List>
				{SIDEBAR_FOOTER_ITEMS.map(item => <Item key={item.title} title={item.title} link={item.link} icon={item.icon} disablePadding />)}
			</List>
		</Stack>
	);
}