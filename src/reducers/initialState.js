export const initialState = {
  // Main data
  shows: [],
  loading: false,
  error: null,

  // Search/Filters
  searchQuery: '',
  genreFilter: 'Todos',
  sortBy: 'rating',
  sortOrder: 'desc',
  currentPage: 0,

  // Favorites
  favorites: [],

  // Navigation
  activeTab: 'home',

  // Details Modal
  modal: {
    isOpen: false,
    loading: false,
    data: null,
    error: null,
  },
};
