import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  Box,
  CardMedia,
  Chip,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Avatar,
  ListItemAvatar,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import { useState } from 'react';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { ACTION_TYPES } from '../../reducers/actionTypes';
import { stripHtml, formatDate } from '../../utils/formatters';
import { Loading } from '../common/Loading';
import { ErrorState } from '../common/ErrorState';
import { FavoriteButton } from '../favorites/FavoriteButton';

export function MediaModal() {
  const { modal } = useAppState();
  const dispatch = useAppDispatch();
  const [tabIndex, setTabIndex] = useState(0);

  const handleClose = () => {
    dispatch({ type: ACTION_TYPES.CLOSE_MODAL });
    setTabIndex(0);
  };

  const show = modal.data;
  const isLoading = modal.loading;
  const error = modal.error;

  return (
    <Dialog
      open={modal.isOpen}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="media-modal-title"
    >
      <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
        <IconButton
          aria-label="fechar"
          onClick={handleClose}
          sx={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff', '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' } }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 0 }}>
        {isLoading && (
          <Box sx={{ py: 8 }}>
            <Loading message="Carregando detalhes da série..." />
          </Box>
        )}

        {error && <ErrorState message={error} />}

        {!isLoading && !error && show && (
          <Box>
            {/* Header Banner / Poster */}
            <Box
              sx={{
                position: 'relative',
                height: { xs: 250, sm: 350 },
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), url(${show.image?.original || show.image?.medium || ''})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItem: 'flex-end',
                p: 3,
              }}
            >
              <Box sx={{ mt: 'auto', color: '#fff', width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <Box>
                    <Typography variant="h4" component="h2" fontWeight={700} gutterBottom>
                      {show.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ color: '#faaf00' }} />
                        <Typography variant="body1" fontWeight={600}>
                          {show.rating?.average || 'N/A'}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {show.premiered ? new Date(show.premiered).getFullYear() : 'N/A'}
                      </Typography>
                      <Typography variant="body2">
                        {show.runtime ? `${show.runtime} min` : ''}
                      </Typography>
                      <Typography variant="body2">
                        {show.network?.name || show.webChannel?.name || ''}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}>
                    <FavoriteButton show={show} />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                  {show.genres?.map((genre) => (
                    <Chip key={genre} label={genre} size="small" sx={{ backgroundColor: 'rgba(255,255,255,0.3)', color: '#fff' }} />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Content Body */}
            <Box sx={{ p: 3 }}>
              <Typography variant="body1" paragraph>
                {stripHtml(show.summary) || 'Sem sinopse disponível.'}
              </Typography>

              <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
                <Tabs value={tabIndex} onChange={(e, val) => setTabIndex(val)} aria-label="detalhes da serie">
                  <Tab label={`Episódios (${show._embedded?.episodes?.length || 0})`} />
                  <Tab label={`Elenco (${show._embedded?.cast?.length || 0})`} />
                </Tabs>
              </Box>

              {/* Episodes Tab */}
              {tabIndex === 0 && (
                <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {show._embedded?.episodes?.length > 0 ? (
                    <List dense>
                      {show._embedded.episodes.map((ep) => (
                        <ListItem key={ep.id} divider>
                          <ListItemText
                            primary={`T${ep.season} E${ep.number}: ${ep.name}`}
                            secondary={`Exibido em: ${formatDate(ep.airdate)} ${ep.runtime ? `(${ep.runtime} min)` : ''}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      Nenhum episódio encontrado.
                    </Typography>
                  )}
                </Box>
              )}

              {/* Cast Tab */}
              {tabIndex === 1 && (
                <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
                  {show._embedded?.cast?.length > 0 ? (
                    <List dense>
                      {show._embedded.cast.map((item, index) => (
                        <ListItem key={index} divider>
                          <ListItemAvatar>
                            <Avatar src={item.person?.image?.medium} alt={item.person?.name} />
                          </ListItemAvatar>
                          <ListItemText
                            primary={item.person?.name}
                            secondary={`Personagem: ${item.character?.name || 'N/A'}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ py: 3, textAlign: 'center' }}>
                      Nenhum membro do elenco encontrado.
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
