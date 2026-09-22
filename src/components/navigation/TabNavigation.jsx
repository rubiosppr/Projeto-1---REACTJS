import { Tabs, Tab, Box } from '@mui/material';
import { useAppState, useAppDispatch } from '../../context/AppContext';
import { ACTION_TYPES } from '../../reducers/actionTypes';

export function TabNavigation() {
  const { activeTab } = useAppState();
  const dispatch = useAppDispatch();

  const handleChange = (event, newValue) => {
    dispatch({ type: ACTION_TYPES.SET_ACTIVE_TAB, payload: newValue });
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
      <Tabs value={activeTab} onChange={handleChange} aria-label="Navegação de Mídia" textColor="primary" indicatorColor="primary">
        <Tab label="Todos os Títulos" value="home" />
        <Tab label="Meus Favoritos" value="favorites" />
      </Tabs>
    </Box>
  );
}
