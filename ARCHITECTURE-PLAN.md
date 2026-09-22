# Arquitetura: Plataforma de Mídia e Busca de Filmes/Séries

> **API:** [TVMaze API](https://www.tvmaze.com/api) (100% aberta, sem chave, sem CORS issues)  
> **UI Library:** MUI (Material UI) — escolha recomendada por ter Skeleton, Modal, Autocomplete e Grid com breakpoints integrados  
> **HTTP Client:** Axios — escolha recomendada por tratamento de erro robusto e interceptors  
> **Estado:** useReducer (garantido por RNF06)

---

## 1. Stack Tecnológica

| Categoria | Tecnologia | Justificativa |
|---|---|---|
| Core | React.js 18+ | Requisito obrigatório |
| Build | Vite | Inicialização rápida, HMR, ESBuild |
| Linguagem | JavaScript (ES6+) | Requisito obrigatório |
| API | TVMaze API | 100% aberta, sem autenticação, sem CORS |
| HTTP | Axios | Interceptors, timeout, tratamento de erro centralizado |
| UI | MUI v5 | Cards, Modal, Skeleton, Grid responsivo, Badges |
| Estado | useReducer + Context | Gerenciamento centralizado (RNF06) |
| Persistência | localStorage | Favoritos persistentes (RF05) |
| Debounce | hook próprio (useDebounce) | Busca sem request a cada tecla |
| Ícones | @mui/icons-material | Favorite, Search, Sort, Star, etc. |

---

## 2. Estrutura de Diretórios

```
src/
├── api/
│   ├── tvmazeClient.js          # Instância Axios + interceptors
│   └── tvmazeService.js         # Funções de API (fetchPopular, search, getDetails, etc.)
├── components/
│   ├── common/
│   │   ├── LoadingSkeleton.jsx  # Skeleton loader (RNF03)
│   │   ├── ErrorMessage.jsx     # Mensagem amigável de erro (RNF04)
│   │   ├── EmptyState.jsx       # Estado vazio (sem resultados)
│   │   └── ScrollToTop.jsx      # Botão "voltar ao topo"
│   ├── layout/
│   │   ├── Header.jsx           # Logo + título
│   │   └── MainLayout.jsx       # Container principal com padding
│   ├── navigation/
│   │   └── TabNavigation.jsx    # Abas: "Todos os Títulos" | "Meus Favoritos" (RF06)
│   ├── search/
│   │   ├── SearchBar.jsx        # Campo de busca com debounce (RF02)
│   │   ├── FilterBar.jsx        # Gênero + ordenação (RF03)
│   │   └── SortControls.jsx     # Selects de ordenação
│   ├── media/
│   │   ├── MediaCard.jsx        # Card: imagem, título, rating, gêneros, botão favorito
│   │   ├── MediaGrid.jsx        # Grid responsivo de cards (RNF02)
│   │   ├── MediaModal.jsx       # Modal com detalhes completos (RF04)
│   │   └── MediaList.jsx        # Lista/container de resultados
│   └── favorites/
│       ├── FavoriteButton.jsx   # Ícone de coração toggle
│       └── FavoritesBadge.jsx   # Badge com contagem
├── hooks/
│   ├── useAppDispatch.js        # Helper para acesso ao dispatch do useReducer
│   ├── useAppSelector.js        # Helper para acesso ao state do useReducer
│   ├── useDebounce.js           # Debounce de valor (300ms)
│   ├── useLocalStorage.js       # Sync entre useReducer e localStorage
│   └── useMediaQuery.js         # Hook de busca (efeitos colaterais)
├── reducers/
│   ├── actionTypes.js           # Constantes de actions
│   ├── initialState.js          # Estado inicial
│   └── appReducer.js            # Reducer principal
├── context/
│   └── AppContext.jsx          # Provider do useReducer + Context
├── utils/
│   ├── formatters.js            # Formatação de rating, data, duração, gêneros
│   ├── constants.js             # Gêneros suportados, opções de ordenação
│   └── helpers.js               # Funções puras (filter, sort, paginate)
├── App.jsx                      # Root component
├── main.jsx                     # Entry point
└── index.css                    # Estilos globais
```

**Justificativa (RNF05):** Diretórios claramente separados por responsabilidade (components, reducers, services(api), hooks, utils). Componentes organizados por feature/domain.

---

## 3. Design do Estado (useReducer)

### 3.1 Action Types (`actionTypes.js`)

| Action | Descrição |
|---|---|
| `FETCH_START` | Início de requisição AJAX (set loading=true, limpa erro) |
| `FETCH_SUCCESS` | Recebido com sucesso (set items, loading=false, hasMore) |
| `FETCH_ERROR` | Falha na requisição (set error message, loading=false) |
| `SET_SEARCH_QUERY` | Atualiza query de busca |
| `SET_GENRE_FILTER` | Filtra por gênero (ou limpa) |
| `SET_SORT_BY` | Ordena por: `rating`, `name`, `premiered` |
| `SET_SORT_ORDER` | Ordem: `asc`, `desc` |
| `SET_PAGE` | Avança/regressa página (infinite scroll) |
| `LOAD_FAVORITES` | Carrega favoritos do localStorage no init |
| `ADD_FAVORITE` | Adiciona item aos favoritos |
| `REMOVE_FAVORITE` | Remove item dos favoritos |
| `TOGGLE_TAB` | Alterna entre `all` e `favorites` |
| `OPEN_MODAL` | Abre modal com item selecionado |
| `CLOSE_MODAL` | Fecha modal |
| `RESET_STATE` | Reseta ao estado inicial (nova busca) |

### 3.2 Estado Inicial (`initialState.js`)

```javascript
{
  // Busca
  query: '',                    // Texto digitado no SearchBar
  isSearching: false,           // Flag: busca ativa vs. showcase inicial

  // Filtros
  filters: {
    genre: null,                // Gênero selecionado ou null (todos)
    sortBy: 'rating',           // rating | name | premiered
    sortOrder: 'desc',          // asc | desc
  },

  // Dados
  items: [],                    // Lista original da API (não filtrada)
  displayedItems: [],           // Items após filtro + sort (derivado)
  page: 0,                      // Página atual para pagination
  hasMore: true,                // Se há mais páginas para carregar

  // Estados de requisição (RNF03)
  loading: false,               // AJAX em andamento
  error: null,                  // Mensagem de erro amigável (RNF04)

  // Favoritos (RF05)
  favorites: [],                // Array de IDs favoritados

  // Navegação por abas (RF06)
  activeTab: 'all',             // all | favorites

  // Modal (RF04)
  modal: {
    open: false,
    item: null,                 // Item completo (pode ter load extra)
    loading: false,             // Loading específico do modal
  },
}
```

### 3.3 Reducer (`appReducer.js`)

O reducer centraliza toda a lógica de transformação de estado. Principais branches:

```javascript
case FETCH_START:
  return { ...state, loading: true, error: null };

case FETCH_SUCCESS:
  return {
    ...state,
    loading: false,
    items: action.payload.items,        // Acumula com paginação
    page: action.payload.page,
    hasMore: action.payload.hasMore,
  };

case FETCH_ERROR:
  return { ...state, loading: false, error: action.payload };

case SET_SEARCH_QUERY:
  return { ...state, query: action.payload, page: 0, items: [] };

case ADD_FAVORITE:
  return {
    ...state,
    favorites: [...state.favorites, action.payload.id],
  };

case REMOVE_FAVORITE:
  return {
    ...state,
    favorites: state.favorites.filter(id => id !== action.payload),
  };

// ...etc
```

### 3.4 Context + Provider

```jsx
// AppContext.jsx
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, init);
  
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
```

**Init function:** Carrega `favorites` do localStorage e dispara a busca inicial de shows populares.

### 3.5 Derivando `displayedItems`

A lista exibida é derivada via `useMemo` ou dentro do reducer, aplicando **cliente-side** as transformações:

1. **Fonte de dados:**
   - Tab "all": usa `items` (da API)
   - Tab "favorites": filtra `items` pelos IDs em `favorites`, ou usa `favorites` + busca individual

2. **Filtro de gênero:** `items.filter(item => item.genres.includes(selectedGenre))`

3. **Ordenação:**
   - `rating`: por `rating.average` (null → 0)
   - `name`: alfabética
   - `premiered`: por data

> **Nota:** A TVMaze API não suporta filtragem por gênero no servidor. Todo filtro/ordenação é cliente-side (RNF01 — full client-side processing).

---

## 4. Camada de Serviços (API)

### 4.1 Cliente Axios (`tvmazeClient.js`)

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.tvmaze.com',
  timeout: 10000,
});

// Interceptor de resposta: transforma erros em mensagens amigáveis (RNF04)
api.interceptors.response.use(
  res => res,
  error => {
    if (error.code === 'ERR_CANCELED') return Promise.reject(error);
    const message = error.response?.status === 404
      ? 'Nenhum resultado encontrado.'
      : 'Erro de conexão. Verifique sua internet e tente novamente.';
    return Promise.reject(new Error(message));
  }
);

export default api;
```

### 4.2 Endpoints Utilizados

| Função | Endpoint | Uso |
|---|---|---|
| `fetchPopularShows(page)` | `GET /shows?page={page}&limit=20` | Vitrine inicial (RF01) |
| `searchShows(query)` | `GET /search/shows?q={query}` | Busca em tempo real (RF02) |
| `getShowDetails(id)` | `GET /shows/{id}?embed[]=episodes&embed[]=cast` | Detalhes + episódios + elenco (RF04) |
| `getShowCast(id)` | `GET /shows/{id}/cast` | Elenco (fallback se embed falhar) |
| `getShowEpisodes(id)` | `GET /shows/{id}/episodes` | Episódios (fallback) |

**Observação sobre busca:** A endpoint `/search/shows` não suporta paginação (retorna todos os resultados). A paginação é aplicada cliente-side sobre o array retornado, carregando em "pages" de 20 itens.

---

## 5. Componentes — Hierarquia e Responsabilidades

### 5.1 `App.jsx` (Root)

- Envolve tudo em `AppProvider`
- Disponibiliza `state` e `dispatch` via Context
- Controla o `activeTab` (all vs. favorites)

### 5.2 `Header.jsx`
- Logo + título da aplicação
- Badge de contagem de favoritos (RF05)

### 5.3 `TabNavigation.jsx` (RF06)
- Botões de aba: "Todos os Títulos" (all) / "Meus Favoritos" (favorites)
- Highlight da aba ativa via `activeTab`
- Em "favorites": mostra itens dos favoritos (persistidos ou filtrados de `items`)

### 5.4 `SearchBar.jsx` (RF02)
- Input controlado com `debounce` (300ms)
- Ícone de busca
- `onChange` → `SET_SEARCH_QUERY` → trigger de busca via `useEffect`

### 5.5 `FilterBar.jsx` (RF03)
- **Genre Filter:** `Select` MUI com opções de gêneros (extraídos das genres de todos os items ou constantes)
- **Sort Selector:** `Select` com opções: "Nota (↓)", "Nota (↑)", "Nome (A-Z)", "Nome (Z-A)", "Ano de estreia (↓)"
- **Clear Filters:** botão para resetar gênero + ordenação

### 5.6 `MediaGrid.jsx` (RNF02)
- Container `Grid` MUI responsivo:
  - Mobile: `xs={12}` (1 coluna)
  - Tablet: `sm={6}` (2 colunas)
  - Desktop: `md={4}` (3 colunas) / `lg={3}` (4 colunas)
- Renderiza `MediaCard` para cada item
- Mensagens condicionais: loading skeleton, empty state, error

### 5.7 `MediaCard.jsx`
- `Card` MUI com:
  - Imagem (`CardMedia`) — placeholder se não houver
  - Título (`CardTitle`)
  - Rating (`Chip` com `StarIcon`)
  - Gêneros (`Chip` múltiplos)
  - `FavoriteButton` sobrepor (overlay top-right)
- `onClick` → `OPEN_MODAL`

### 5.8 `FavoriteButton.jsx` (RF05)
- Ícone `Favorite` ou `FavoriteBorder` (preenchido = favorito)
- `onClick`: toggle `ADD_FAVORITE` / `REMOVE_FAVORITE`
- Sincroniza com `localStorage` via `useLocalStorage`

### 5.9 `MediaModal.jsx` (RF04, RNF01)
- `Modal` MUI (não recarrega página)
- Carrega detalhes via `getShowDetails(id)` (embed episodes + cast)
- Layout em `Grid`:
  - Coluna esquerda: imagem original + rating
  - Coluna direita: título, status, gêneros, sinopse (HTML renderizado), data de estreia
  - Seção "Episódios": lista de episódios (collapsible)
  - Seção "Elenco": cards de atores (imagem + nome personagem)
- Close: botão `X`, backdrop click, `Escape`
- Loading interno: `Skeleton` enquanto busca detalhes

### 5.10 Componentes Auxiliares
- **`LoadingSkeleton.jsx`**: 8 `Skeleton` cards em grid (RNF03)
- **`ErrorMessage.jsx`**: `Alert` MUI com ícone de erro + botão "Tentar novamente"
- **`EmptyState.jsx`**: `Box` com texto "Nenhum resultado encontrado" + sugestão

---

## 6. Hooks Personalizados

| Hook | Responsabilidade |
|---|---|
| `useDebounce(value, delay)` | Retorna valor com delay para evitar requests excessivos |
| `useLocalStorage(key, initialValue)` | Getter/setter sincronizado com localStorage para favoritos (RF05) |
| `useAppDispatch()` | `useContext(AppContext)` → dispatch |
| `useAppSelector()` | `useContext(AppContext)` → state |

---

## 7. Fluxo de Dados e Interações

### 7.1 Boot da Aplicação
1. `AppProvider` monta
2. `init` do reducer carrega `favorites` do localStorage
3. `useEffect` em `App` ou `MediaList` despacha busca inicial: `SET_SEARCH_QUERY('')` → `FETCH_START` → `fetchPopularShows(0)` → `FETCH_SUCCESS`
4. Exibe `MediaGrid` com skeletons durante loading

### 7.2 Busca em Tempo Real (RF02)
```
User digita → SearchBar onChange → useDebounce (300ms) →
  dispatch SET_SEARCH_QUERY → useEffect detecta mudança →
  dispatch RESET_STATE → dispatch FETCH_START →
  api.searchShows(query) → dispatch FETCH_SUCCESS / FETCH_ERROR
```

### 7.3 Filtros e Ordenação (RF03)
```
User muda filtro → FilterBar onChange → dispatch SET_GENRE_FILTER / SET_SORT_BY →
  useMemo recompute displayedItems (cliente-side)
```

### 7.4 Modal (RF04, RNF01)
```
User clica card → dispatch OPEN_MODAL(item) →
  MediaModal abre (sem page reload) →
  useEffect com item.id → api.getShowDetails(id) →
  Renderiza sinopse, elenco, episódios →
  User fecha → dispatch CLOSE_MODAL
```

### 7.5 Favoritos (RF05)
```
User clica coração → FavoriteButton toggle →
  dispatch ADD_FAVORITE(id) / REMOVE_FAVORITE(id) →
  useLocalStorage sync → localStorage.setItem('favorites', [...])
```

### 7.6 Navegação por Abas (RF06)
```
User clica aba "Favoritos" → TabNavigation → dispatch TOGGLE_TAB('favorites') →
  MediaList filtra items por favorites (ou localStorage) →
  Renderiza apenas items favoritados
```

---

## 8. Design Responsivo (RNF02)

Baseado em breakpoints do MUI Grid:

| Breakpoint | Columns | Card Behavior |
|---|---|---|
| `< 600px` (Mobile) | 1 coluna (`xs={12}`) | Stack vertical, SearchBar cheia |
| `600–900px` (Tablet) | 2 colunas (`sm={6}`) | Grid 2-col, FilterBar em linha |
| `900–1200px` (Desktop) | 3 colunas (`md={4}`) | Grid 3-col, layout padrão |
| `> 1200px` (Wide) | 4 colunas (`lg={3}`) | Grid 4-col |

Modal: em mobile, ocupa 90vw; em desktop, 70vw ou 600px fixo.

---

## 9. Tratamento de Erros (RNF04)

| Cenário | Ação |
|---|---|
| Falha de conexão (offline/network error) | Exibir `ErrorMessage` com ícone de rede + botão "Tentar novamente" |
| Resultado vazio (busca sem matches) | Exibir `EmptyState` com sugestão de termo alternativo |
| Timeout da API | Mensagem "A requisição demorou muito. Tente novamente." |
| Erro 404 (show não existe) | Fallback para detalhe básico sem episódios/cast |

---

## 10. Critérios de Validação

| Critério | Validação |
|---|---|
| RF01 — Vitrine inicial | `/shows?page=0` carrega ao montar; exibe cards com Skeleton durante loading |
| RF02 — Busca em tempo real | 300ms debounce; AJAX sem reload; resultados aparecem dinamicamente |
| RF03 — Filtragem e ordenação | Gênero filtra cliente-side; 5 opções de ordenação aplicadas via useMemo |
| RF04 — Detalhes no modal | Click no card abre Modal MUI; carrega `/shows/{id}?embed[]=episodes&embed[]=cast` |
| RF05 — Favoritos local | FavoriteButton toggle; persiste em localStorage; badge atualiza |
| RF06 — Abas de navegação | TabNavigation all/favorites; troca de aba filtra lista sem reload |
| RNF01 — SPA | Nenhum `window.location`; navegação via React Router DOM (não-full-reload) |
| RNF02 — Responsivo | Grid breakpoints testados em mobile/tablet/desktop |
| RNF03 — Feedback visual | Skeleton mostra durante fetch; Spinner em Modal; Error Alert |
| RNF04 — Tratamento de erro | Mensagens amigáveis + retry button |
| RNF05 — Clean code | Diretórios claros: components, reducers, api, hooks, utils |
| RNF06 — useReducer obrigatório | Todo estado principal via useReducer com actions tipadas |

---

## 11. Decisões Técnicas por Trás das Escolhas

### 11.1 Por que TVMaze e não TMDB?
- **TVMaze:** 100% gratuita, sem chave de API, sem rate limiting, CORS permissivo
- **TMDB:** Exige cadastro, chave API, rate limit por IP (40 req/10s), CORS configurado

### 11.2 Por que MUI e não React-Bootstrap?
- MUI oferece `Skeleton` (RNF03) e `Modal` com backdrop integrado, `Grid` com sistema de breakpoints mais robusto, e `useMediaQuery` para responsividade avançada
- React-Bootstrap não tem componente Skeleton nativo; exigiria implementação custom

### 11.3 Por que Axios e não Fetch nativo?
- Interceptors centralizam tratamento de erro (RNF04)
- `timeout` configurado evita requests pendurados
- `CancelToken`/`AbortController` para cancelar requests anteriores durante debounce

### 11.4 Por que filtragem cliente-side?
- TVMaze não suporta parâmetros de gênero/ordenação na API
- Filtragem cliente-side é mais rápida para o usuário (sem nova requisição)
- Paginação mantida: a cada nova busca, reseta página 0

---

## 12. Cronograma Estimado (por fase)

| Fase | Tarefas | Estimativa |
|---|---|---|
| 1. Setup | Vite + React + MUI + Axios + estrutura de pastas | 15 min |
| 2. API Layer | Client Axios + Service Layer | 20 min |
| 3. State (useReducer) | actionTypes, initialState, reducer, Context | 30 min |
| 4. Components base | Header, TabNavigation, SearchBar, FilterBar | 25 min |
| 5. Media Components | MediaCard, MediaGrid, LoadingSkeleton, ErrorMessage | 30 min |
| 6. Modal + Detalhes | MediaModal com episodes + cast | 40 min |
| 7. Favoritos | FavoriteButton, localStorage sync, badge | 25 min |
| 8. Integração + Debounce | useDebounce, useEffects de busca | 25 min |
| 9. Responsividade | Breakpoints Grid, Mobile-first CSS | 20 min |
| 10. Testes + Ajustes | Validar todos os RF/RNF | 25 min |

**Total estimado: ~3h30 de desenvolvimento focado**

---

## 13. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| TVMaze pode ter indisponibilidade | Interceptor de erro + mensagem "Tentar novamente" |
| Muitos resultados de busca sem paginação server-side | Paginação cliente-side (20 items/page) |
| Imagens quebradas (sem image.medium) | Placeholder MUI padrão |
| localStorage bloqueado (modo incognito restrito) | try/catch wrapper no useLocalStorage |
| Summaries HTML injection | Sanitizar com `strip-tags` ou DOMPurify (light) |
