import Box from '@mui/material/Box';

type WrapperProps = {
  children: React.ReactNode
}

export default function BgWrapper({ children } : WrapperProps) {
  return (
    <Box height="100vh" width="100vw" style={{ backgroundColor: '#f4f6fa', padding: '3%' }} sx={{ display: 'flex' }}>
      {children}
    </Box>
  );
}