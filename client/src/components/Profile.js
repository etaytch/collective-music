import React, { Component } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Spotify from './Spotify';
import Youtube from './Youtube';

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
        Show Spotify
      </button>
    );
  }

  renderYoutubeButton() {
    const { showYoutube } = this.state;
    if (!this.props.auth.youtube) {
      return (
        <a href="/auth/youtube">
          <button className="waves-effect waves-light btn">
            Connect to Youtube
          </button>
        </a>
      );
    }

    return (
      <button
        className="waves-effect waves-light btn"
        onClick={() => this.setState({ showYoutube: !showYoutube })}
      >
        Show Youtube
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
        {this.renderYoutubeButton()}

        <button className="waves-effect waves-light btn">
          Connect to iTunes
        </button>
        {this.state.showSpotify && (
          <div>
            <h2>Spotify:</h2>
            <Spotify />
          </div>
        )}
        {this.state.showYoutube && (
          <div>
            <br />
            <br />
            <br />
            <h2>Youtube:</h2>
            <Youtube />{' '}
          </div>
        )}
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
