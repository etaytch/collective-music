import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Spotify from './Spotify';

class Profile extends Component {
  state = {
    showSpotify: false
  };

  renderSpotifyButton() {
    const { showSpotify } = this.state;
    if (!this.props.auth.spotify) {
      return (
        <a href="/auth/spotify">
          <button className="waves-effect waves-light btn">
            Connect to Spotify
          </button>
        </a>
      );
    }

    return (
      <button
        className="waves-effect waves-light btn"
        onClick={() => this.setState({ showSpotify: !showSpotify })}
      >
        Show Spotify playlists
      </button>
    );
  }

  render() {
    if (!this.props.auth) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {this.renderSpotifyButton()}
        <button className="waves-effect waves-light btn">
          Connect to Youtube
        </button>
        <button className="waves-effect waves-light btn">
          Connect to iTunes
        </button>
        {this.state.showSpotify && <Spotify />}
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

export default connect(mapStateToProps)(Profile);
