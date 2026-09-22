import { ACTION_TYPES } from './actionTypes';

export const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.FETCH_START:
      return { ...state, loading: true, error: null };
    case ACTION_TYPES.FETCH_SUCCESS:
      return { ...state, loading: false, shows: action.payload };
    case ACTION_TYPES.FETCH_ERROR:
      return { ...state, loading: false, error: action.payload };

    case ACTION_TYPES.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload, currentPage: 0 };
    case ACTION_TYPES.SET_GENRE_FILTER:
      return { ...state, genreFilter: action.payload, currentPage: 0 };
    case ACTION_TYPES.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case ACTION_TYPES.SET_SORT_ORDER:
      return { ...state, sortOrder: action.payload };
    case ACTION_TYPES.SET_PAGE:
      return { ...state, currentPage: action.payload };

    case ACTION_TYPES.ADD_FAVORITE:
      return { ...state, favorites: [...state.favorites, action.payload] };
    case ACTION_TYPES.REMOVE_FAVORITE:
      return { ...state, favorites: state.favorites.filter(fav => fav.id !== action.payload.id) };
    case ACTION_TYPES.LOAD_FAVORITES:
      return { ...state, favorites: action.payload };

    case ACTION_TYPES.SET_ACTIVE_TAB:
      return { ...state, activeTab: action.payload, currentPage: 0 };

    case ACTION_TYPES.OPEN_MODAL:
      return { ...state, modal: { ...state.modal, isOpen: true, data: null, error: null } };
    case ACTION_TYPES.CLOSE_MODAL:
      return { ...state, modal: { ...state.modal, isOpen: false, data: null, error: null } };
    case ACTION_TYPES.SET_MODAL_LOADING:
      return { ...state, modal: { ...state.modal, loading: action.payload } };
    case ACTION_TYPES.SET_MODAL_DATA:
      return { ...state, modal: { ...state.modal, data: action.payload, loading: false } };
    case ACTION_TYPES.SET_MODAL_ERROR:
      return { ...state, modal: { ...state.modal, error: action.payload, loading: false } };

    case ACTION_TYPES.RESET_FILTERS:
      return { ...state, searchQuery: '', genreFilter: 'Todos', sortBy: 'rating', currentPage: 0 };

    default:
      return state;
  }
};
