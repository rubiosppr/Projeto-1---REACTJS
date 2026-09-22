import { useEffect, useMemo, useCallback } from 'react';
import { Box, Typography, Pagination } from '@mui/material';
import { AppProvider, useAppState, useAppDispatch } from './context/AppContext';
import { ACTION_TYPES } from './reducers/actionTypes';
import { tvMazeService } from './api/tvMazeService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/layout/Header';
import { MainLayout } from './components/layout/MainLayout';
import { TabNavigation } from './components/navigation/TabNavigation';
import { SearchBar } from './components/search/SearchBar';
import { FilterBar } from './components/search/FilterBar';
import { MediaGrid } from './components/media/MediaGrid';
import { MediaModal } from './components/media/MediaModal';
import { Loading } from './components/common/Loading';
import { ErrorState } from './components/common/ErrorState';
import { EmptyState } from './components/common/EmptyState';
import { ITEMS_PER_PAGE } from './utils/constants';

function AppContent() {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const [storedFavorites, setStoredFavorites] = useLocalStorage('cinewave_favorites', []);

  const debouncedSearchQuery = useDebounce(state.searchQuery, 300);

  // Sync localStorage favorites into state on mount
  useEffect(() => {
    if (storedFavorites.length > 0) {
      dispatch({ type: ACTION_TYPES.LOAD_FAVORITES, payload: storedFavorites });
    }
  }, []);

  // Sync state favorites to localStorage when changed
  useEffect(() => {
    setStoredFavorites(state.favorites);
  }, [state.favorites, setStoredFavorites]);

  // Fetch shows based on active tab & search query
  const loadShows = useCallback(async () => {
    dispatch({ type: ACTION_TYPES.FETCH_START });
    try {
      if (debouncedSearchQuery.trim() !== '') {
        const response = await tvMazeService.searchShows(debouncedSearchQuery);
        // /search/shows returns array of { score, show }
        const showsList = response.data.map((item) => item.show);
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: showsList });
      } else {
        // Default paginated shows
        const response = await tvMazeService.getShows(0);
        dispatch({ type: ACTION_TYPES.FETCH_SUCCESS, payload: response.data });
      }
    } catch (err) {
      dispatch({ type: ACTION_TYPES.FETCH_ERROR, payload: err.message || 'Erro ao carregar dados.' });
    }
  }, [debouncedSearchQuery, dispatch]);

  useEffect(() => {
    if (state.activeTab === 'home') {
      loadShows();
    }
  }, [debouncedSearchQuery, state.activeTab, loadShows]);

  // Filter and paginate current list
  const filteredAndPaginatedShows = useMemo(() => {
    let list = state.activeTab === 'favorites' ? state.favorites : state.shows;

    // Client-side genre filtering
    if (state.genreFilter !== 'Todos') {
      list = list.filter((show) => show.genres && show.genres.includes(state.genreFilter));
    }

    // Client-side sorting by rating
    list = [...list].sort((a, b) => {
      const ratingA = a.rating?.average || 0;
      const ratingB = b.rating?.average || 0;
      return ratingB - ratingA;
    });

    const totalPages = Math.ceil(list.length / ITEMS_PER_PAGE) || 1;
    const startIndex = state.currentPage * ITEMS_PER_PAGE;
    const paginated = list.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return {
      paginated,
      totalPages,
      totalCount: list.length,
    };
  }, [state.shows, state.favorites, state.activeTab, state.genreFilter, state.currentPage]);

  // Handle select show to open modal and fetch details with embedded episodes & cast
  const handleSelectShow = async (id) => {
    dispatch({ type: ACTION_TYPES.OPEN_MODAL });
    dispatch({ type: ACTION_TYPES.SET_MODAL_LOADING, payload: true });
    try {
      const response = await tvMazeService.getShowDetails(id, ['episodes', 'cast']);
      dispatch({ type: ACTION_TYPES.SET_MODAL_DATA, payload: response.data });
    } catch (err) {
      dispatch({ type: ACTION_TYPES.SET_MODAL_ERROR, payload: err.message || 'Erro ao carregar detalhes.' });
    }
  };

  return (
    <>
      <Header>
        {state.activeTab === 'home' && (
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
            <SearchBar />
            <FilterBar />
          </Box>
        )}
      </Header>

      <MainLayout>
        <TabNavigation />

        {state.loading && state.activeTab === 'home' && <Loading />}

        {state.error && state.activeTab === 'home' && (
          <ErrorState message={state.error} onRetry={loadShows} />
        )}

        {!state.loading && !state.error && (
          <>
            {filteredAndPaginatedShows.paginated.length === 0 ? (
              <EmptyState
                title={state.activeTab === 'favorites' ? 'Nenhum favorito salvo' : 'Nenhuma série encontrada'}
                description={
                  state.activeTab === 'favorites'
                    ? 'Explore o catálogo e clique no ícone de coração para adicionar suas séries favoritas.'
                    : 'Tente buscar por outro termo ou remover os filtros aplicados.'
                }
              />
            ) : (
              <>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Exibindo {filteredAndPaginatedShows.paginated.length} de {filteredAndPaginatedShows.totalCount} resultados
                  </Typography>
                </Box>

                <MediaGrid
                  shows={filteredAndPaginatedShows.paginated}
                  onSelectShow={handleSelectShow}
                />

                {filteredAndPaginatedShows.totalPages > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                      count={filteredAndPaginatedShows.totalPages}
                      page={state.currentPage + 1}
                      onChange={(e, page) => dispatch({ type: ACTION_TYPES.SET_PAGE, payload: page - 1 })}
                      color="primary"
                    />
                  </Box>
                )}
              </>
            )}
          </>
        )}
      </MainLayout>

      <MediaModal />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
