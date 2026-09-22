import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export function ErrorState({ message, onRetry }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px',
        textAlign: 'center',
        p: 3,
        gap: 2,
      }}
    >
      <ErrorOutlineIcon color="error" sx={{ fontSize: 64 }} />
      <Typography variant="h6" color="text.primary">
        Ocorreu um erro
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {message || 'Não foi possível carregar os dados solicitados.'}
      </Typography>
      {onRetry && (
        <Button variant="contained" color="primary" onClick={onRetry} sx={{ mt: 1 }}>
          Tentar Novamente
        </Button>
      )}
    </Box>
  );
}
