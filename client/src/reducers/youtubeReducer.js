import { FETCH_YOUTUBE_PLAYLISTS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_YOUTUBE_PLAYLISTS:
      return action.payload;
    default:
      return state;
  }
}
