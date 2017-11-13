import axios from 'axios';
import { FETCH_USER } from './types';
import { FETCH_PLAYLISTS } from './types';

export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  console.log('in fetchUser: ', res.data);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fecthSpotifyPlaylists = () => async dispatch => {
  const res = await axios.get('/api/spotify/playlists');
  dispatch({ type: FETCH_PLAYLISTS, payload: res.data });
};
