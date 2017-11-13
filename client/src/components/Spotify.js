import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fecthSpotifyPlaylists } from '../actions';
import _ from 'lodash';

class Spotify extends Component {
  componentDidMount() {
    this.props.fecthSpotifyPlaylists();
  }

  renderTracks(tracks) {
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
    if (!this.props.spotify) {
      return (
        <div>
          <h3>Loading user playlists...</h3>
        </div>
      );
    } else {
      const playlists = _.map(this.props.spotify.playlists, playlist => {
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

      return (
        <div>
          <h3>Playlists:</h3>
          {playlists}
        </div>
      );
    }
  }

  showUser() {
    // console.log('this.props.spotify: ', this.props.spotify);
    if (this.props.spotify.user) {
      return (
        <div>
          <h3>User Info:</h3>
          <h5>
            DisplayName:{' '}
            <a target="_blank" href={this.props.spotify.user.profileURL}>
              {this.props.spotify.user.displayName}
            </a>
          </h5>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Loading user info...</h3>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div>
          {this.showUser()}
          {this.renderPlaylists()}
        </div>
      </div>
    );
  }
}

function mapStateToProps({ auth, spotify }) {
  return {
    auth,
    spotify
  };
}

export default connect(mapStateToProps, { fecthSpotifyPlaylists })(Spotify);
