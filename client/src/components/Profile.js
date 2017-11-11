import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fecthPlaylists } from '../actions';
import _ from 'lodash';

class Playlists extends Component {
  componentDidMount() {
    this.props.fecthPlaylists();
  }

  renderTracks(tracks) {
    // console.log('renderTracks tracks: ' + JSON.stringify(tracks, null, 4));
    return tracks.map(track => {
      return (
        <li key={track.trackId}>
          ({track.trackNumber}) {track.artistName} - {track.albumName} -{' '}
          {track.trackName}
        </li>
      );
    });
  }

  renderPlaylists() {
    return _.map(this.props.profile, playlist => {
      return (
        <div className="card darken-1" key={playlist.playlistInfo.id}>
          <div className="card-content">
            <span className="card-title">
              Playlist: {playlist.playlistInfo.name}
            </span>
            Tracks: <ul>{this.renderTracks(playlist.tracks)}</ul>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <h2>Playlists:</h2>
        {this.renderPlaylists()}
      </div>
    );
  }
}

function mapStateToProps({ auth, profile }) {
  return {
    auth,
    profile
  };
}

export default connect(mapStateToProps, { fecthPlaylists })(Playlists);
