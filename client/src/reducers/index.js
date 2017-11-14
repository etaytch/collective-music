import { combineReducers } from 'redux';
import { reducer as fromForm } from 'redux-form';
import authReducer from './authReducer';
import spotifyReducer from './spotifyReducer';
import youtubeReducer from './youtubeReducer';

export default combineReducers({
  auth: authReducer,
  spotify: spotifyReducer,
  youtube: youtubeReducer,
  form: fromForm
});
