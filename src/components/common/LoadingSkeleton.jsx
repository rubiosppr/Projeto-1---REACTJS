import { Grid, Skeleton, Card, CardContent } from '@mui/material';

export function LoadingSkeleton({ count = 8 }) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          <Card>
            <Skeleton variant="rectangular" height={300} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={32} />
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="40%" height={24} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
