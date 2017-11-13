import axios from 'axios';
import {
  FETCH_USER,
  FETCH_SPOTIFY_PLAYLISTS,
  FETCH_YOUTUBE_PLAYLISTS
} from './types';

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
  dispatch({ type: FETCH_SPOTIFY_PLAYLISTS, payload: res.data });
};

export const fecthYoutubePlaylists = () => async dispatch => {
  const res = await axios.get('/api/youtube/playlists');
  console.log('fecthYoutubePlaylists res.data: ', res.data);
  dispatch({ type: FETCH_YOUTUBE_PLAYLISTS, payload: res.data });
};
