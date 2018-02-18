import { createStore, combineReducers } from 'redux';

const defaultStore = {
  formState: {
    index: null,
    mode: 'ADD', // ADD or EDIT
    filterUrl: '',
    redirectUrl: '',
  },
  options: [],
};

const optionsReducer = (store = defaultStore.options, action) => {
  switch (action.type) {
    case 'ADD_OPTION':
      return [...store, action.option];
    case 'DELETE_OPTION':
      return store.filter((o, i) => !(i === action.index));
    case 'UPDATE_OPTION':
      return store.map((opt, i) => {
        if (i === action.data.index) {
          return action.data.option;
        }
        return opt;
      });
    default:
      return store;
  }
};

const formReducer = (store = defaultStore.formState, action) => {
  switch (action.type) {
    case 'UPDATE_FORM':
      return Object.assign({}, store, action.data);
    case 'RESET_FORM':
      return defaultStore.formState;
    default:
      return store;
  }
};

const rootReducer = combineReducers({ options: optionsReducer, formState: formReducer });
const optionsStore = createStore(rootReducer);

export default optionsStore;
