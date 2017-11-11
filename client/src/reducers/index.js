import { combineReducers } from 'redux';
import { reducer as fromForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';

export default combineReducers({
  auth: authReducer,
  surveys: surveysReducer,
  form: fromForm
});
