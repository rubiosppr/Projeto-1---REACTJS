import { Box, CircularProgress, Typography } from '@mui/material';

export function Loading({ message = 'Carregando conteúdos...' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        gap: 2,
      }}
    >
      <CircularProgress color="primary" />
      <Typography variant="body1" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
