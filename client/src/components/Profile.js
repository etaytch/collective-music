import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fecthPlaylists } from '../actions';
import _ from 'lodash';

class Profile extends Component {
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
    if (this.props.profile.length < 1) {
      return (
        <div>
          <h3>Loading user playlists...</h3>
        </div>
      );
    } else {
      const playlists = _.map(this.props.profile, playlist => {
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
    if (this.props.auth) {
      return (
        <div>
          <h3>User Info:</h3>
          <h5>
            DisplayName:{' '}
            <a target="_blank" href={this.props.auth.spotifyProfileURL}>
              {this.props.auth.spotifyDisplayName}
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
    console.log('showUser:', this.props.auth);
    // return ({ this.props.auth.spotifyDisplayName ? this.props.auth.spotifyDisplayName : 'Loading..' });
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

function mapStateToProps({ auth, profile }) {
  return {
    auth,
    profile
  };
}

export default connect(mapStateToProps, { fecthPlaylists })(Profile);
