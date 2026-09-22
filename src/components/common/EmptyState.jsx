import { Box, Typography } from '@mui/material';
import SearchOffIcon from '@mui/icons-material/SearchOff';

export function EmptyState({ title = 'Nenhum resultado encontrado', description = 'Tente ajustar sua busca ou filtros para encontrar o que procura.' }) {
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
        gap: 1.5,
      }}
    >
      <SearchOffIcon color="action" sx={{ fontSize: 60 }} />
      <Typography variant="h6" color="text.primary">
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
        {description}
      </Typography>
    </Box>
  );
}
