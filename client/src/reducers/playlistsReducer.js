import { FETCH_PLAYLISTS } from '../actions/types';

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_PLAYLISTS:
      // console.log('action.payload: ' + JSON.stringify(action.payload, null, 4));

      return action.payload;
    default:
      return state;
  }
}
