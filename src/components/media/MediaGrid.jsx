import { Grid } from '@mui/material';
import { MediaCard } from './MediaCard';

export function MediaGrid({ shows, onSelectShow }) {
  return (
    <Grid container spacing={3}>
      {shows.map((show) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={show.id}>
          <MediaCard show={show} onClick={() => onSelectShow(show.id)} />
        </Grid>
      ))}
    </Grid>
  );
}
