import { createStore, combineReducers } from 'redux';

const defaultStore = {
  formState: {
    index: '',
    mode: 'ADD', // ADD or EDIT
    filterUrl: '',
    redirectUrl: '',
  },
  options: [],
  notification: {
    message: '',
    show: false,
    timeout: 1000,
  },
};

const optionsReducer = (store = defaultStore.options, action) => {
  switch (action.type) {
    case 'ADD_OPTION':
      return [...store, action.option];
    case 'DELETE_OPTION':
      return store.filter((o, i) => !(i.toString() === action.index));
    case 'UPDATE_OPTION':
      return store.map((opt, i) => {
        if (i.toString() === action.data.index) {
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

const notificationReducer = (store = defaultStore.notification, action) => {
  if (action.type === 'NOTIFY') {
    return Object.assign({}, store, action.data);
  }
  if (action.type === 'RESET') {
    return defaultStore.notification;
  }
  return store;
};

const rootReducer = combineReducers({
  options: optionsReducer,
  formState: formReducer,
  notification: notificationReducer,
});
const optionsStore = createStore(rootReducer);

export default optionsStore;
