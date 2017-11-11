import { combineReducers } from 'redux';
import { reducer as fromForm } from 'redux-form';
import authReducer from './authReducer';
import surveysReducer from './surveysReducer';
import playlistsReducer from './playlistsReducer';

export default combineReducers({
  auth: authReducer,
  surveys: surveysReducer,
  playlists: playlistsReducer,
  form: fromForm
});
