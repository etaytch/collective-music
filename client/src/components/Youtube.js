import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fecthYoutubePlaylists } from '../actions';
import _ from 'lodash';

class Youtube extends Component {
  componentDidMount() {
    this.props.fecthYoutubePlaylists();
  }

  renderTracks(tracks) {
    return tracks.map(track => {
      return (
        <li key={track.trackURL}>
          ({track.trackNumber}) {track.trackName}
        </li>
      );
    });
  }

  renderPlaylists() {
    if (!this.props.youtube) {
      return (
        <div>
          <h3>Loading user playlists...</h3>
        </div>
      );
    } else {
      console.log('youtube playlists: ', this.props.youtube.playlists);

      const playlists = _.map(this.props.youtube.playlists, playlist => {
        console.log('youtube playlist: ', playlist);
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
    // console.log('this.props.youtube: ', this.props.youtube);
    if (this.props.youtube.user) {
      return (
        <div>
          <h3>User Info:</h3>

          <h5>
            DisplayName:{' '}
            <a
              target="_blank"
              href={`https://www.youtube.com/channel/${this.props.youtube.user
                .profileURL}`}
            >
              {this.props.youtube.user.displayName}
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

function mapStateToProps({ auth, youtube }) {
  return {
    auth,
    youtube
  };
}

export default connect(mapStateToProps, { fecthYoutubePlaylists })(Youtube);
