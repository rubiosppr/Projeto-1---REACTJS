import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { ACTION_TYPES } from '../../reducers/actionTypes';

export function FavoriteButton({ show }) {
  const { favorites } = useAppState();
  const dispatch = useAppDispatch();

  const isFavorite = favorites.some((fav) => fav.id === show.id);

  const toggleFavorite = (e) => {
    e.stopPropagation();
    if (isFavorite) {
      dispatch({ type: ACTION_TYPES.REMOVE_FAVORITE, payload: show });
    } else {
      dispatch({ type: ACTION_TYPES.ADD_FAVORITE, payload: show });
    }
  };

  return (
    <Tooltip title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
      <IconButton onClick={toggleFavorite} color="error" aria-label="favorito">
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>
    </Tooltip>
  );
}
