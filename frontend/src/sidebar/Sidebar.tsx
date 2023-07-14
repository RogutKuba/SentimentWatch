import { useRouter } from 'next/router';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Header from './Header';
import { SIDEBAR_ITEMS } from './constants';
import Item from './Item';
import Footer from './Footer';

const drawerWidth = 240;

export default function Sidebar() {
	const router = useRouter();

	return (
		<Box>
			<Drawer
				anchor='left'
				variant='permanent'
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					'& .MuiDrawer-paper': {
						width: drawerWidth,
						boxSizing: 'border-box',
					},
				}}
			>
				<Stack
					height="100%"
					direction="column"
					justifyContent="space-between"
				>
					<Header />
					<List>
						<Divider/>
						{SIDEBAR_ITEMS.map(item =>
							<Stack key={item.title}>
								<Item title={item.title} link={item.link} icon={item.icon} highlighted={router?.pathname == item.link}/>
								<Divider/>
							</Stack>
						)}
					</List>
					<Footer />
				</Stack>
			</Drawer>
		</Box>
	);
}