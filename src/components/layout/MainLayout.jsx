import { Box, Container } from '@mui/material';

export function MainLayout({ children }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}
