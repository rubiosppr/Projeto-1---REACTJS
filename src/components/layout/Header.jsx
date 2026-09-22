import { AppBar, Toolbar, Typography, Container, Box } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';

export function Header({ children }) {
  return (
    <AppBar position="sticky" elevation={1} sx={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between', minHeight: '70px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <MovieIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{
                fontWeight: 700,
                letterSpacing: '.1rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              CINEWAVE
            </Typography>
          </Box>
          {children}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
