import { combineReducers } from 'redux';
import { reducer as fromForm } from 'redux-form';
import authReducer from './authReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  form: fromForm
});
