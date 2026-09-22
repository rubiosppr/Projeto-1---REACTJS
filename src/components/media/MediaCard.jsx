import { Card, CardMedia, CardContent, Typography, Box, Chip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FavoriteButton } from '../favorites/FavoriteButton';

export function MediaCard({ show, onClick }) {
  const imageUrl = show.image?.medium || 'https://via.placeholder.com/210x295?text=Sem+Imagem';
  const rating = show.rating?.average || 'N/A';
  const genres = show.genres || [];

  return (
    <Card
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <Box sx={{ position: 'relative', pt: '140%', backgroundColor: '#e0e0e0' }}>
        <CardMedia
          component="img"
          image={imageUrl}
          alt={show.name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
        <Box sx={{ position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 1 }}>
          <FavoriteButton show={show} />
        </Box>
      </Box>
      <CardContent sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 2 }}>
        <Box>
          <Typography variant="subtitle1" component="div" noWrap sx={{ fontWeight: 600, mb: 0.5 }}>
            {show.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
            <StarIcon sx={{ color: '#faaf00', fontSize: 18 }} />
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              {rating}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {genres.slice(0, 2).map((genre) => (
            <Chip key={genre} label={genre} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
