import { Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { GENRES } from '../../utils/constants';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { ACTION_TYPES } from '../../reducers/actionTypes';

export function FilterBar() {
  const { genreFilter } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ minWidth: 150 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Gênero</InputLabel>
        <Select
          value={genreFilter}
          label="Gênero"
          onChange={(e) => dispatch({ type: ACTION_TYPES.SET_GENRE_FILTER, payload: e.target.value })}
          sx={{ backgroundColor: '#fff' }}
        >
          {GENRES.map((genre) => (
            <MenuItem key={genre} value={genre}>{genre}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
