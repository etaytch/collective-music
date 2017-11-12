import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Header extends Component {
  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <li key="1">
            <a href="/auth/spotify">Login With Spotify</a>
          </li>
        );
      default:
        return [
          <li key="2">
            <a href="/api/logout">Logout</a>
          </li>,
          <li key="1">
            <a href="/profile">
              <i className="large material-icons">account_circle</i>
            </a>
          </li>
        ];
    }
  }

  render() {
    console.log(this);
    return (
      <nav>
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? '/profile' : '/'}
            className="left brand-logo"
          >
            Collective Music
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav>
    );
  }
}

function mapStateToProps({ auth }) {
  return { auth };
}

export default connect(mapStateToProps)(Header);
