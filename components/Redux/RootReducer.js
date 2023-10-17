import { combineReducers } from 'redux';
import authenticationReducer from './AuthenticationReducer';

const RootReducer = combineReducers({
  authentication: authenticationReducer,
});

export default RootReducer;