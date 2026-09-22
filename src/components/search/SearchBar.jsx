import { TextField, InputAdornment, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useAppDispatch, useAppState } from '../../context/AppContext';
import { ACTION_TYPES } from '../../reducers/actionTypes';

export function SearchBar() {
  const { searchQuery } = useAppState();
  const dispatch = useAppDispatch();

  return (
    <Box sx={{ width: { xs: '100%', sm: 300 } }}>
      <TextField
        fullWidth
        placeholder="Buscar séries..."
        variant="outlined"
        size="small"
        value={searchQuery}
        onChange={(e) => dispatch({ type: ACTION_TYPES.SET_SEARCH_QUERY, payload: e.target.value })}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          sx: { backgroundColor: '#fff', borderRadius: 2 }
        }}
      />
    </Box>
  );
}
