import axios from 'axios';
import { FETCH_USER } from './types';
import { FETCH_SURVEYS } from './types';
import { FETCH_PLAYLISTS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);

  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};

export const fecthPlaylists = () => async dispatch => {
  const res = await axios.get('/api/spotify/playlists');
  console.log('playlistTracks details: ' + JSON.stringify(res.data, null, 4));
  dispatch({ type: FETCH_PLAYLISTS, payload: res.data });
};
