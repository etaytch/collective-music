import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchSurveys } from '../../actions';

class SurveyList extends Component {
  componentDidMount() {
    this.props.fetchSurveys();
  }

  renderSurveys() {
    return this.props.surveys.reverse().map(survey => {
      return (
        <div className="card darken-1" key={survey._id}>
          <div className="card-content">
            <span className="card-title">{survey.title}</span>
            <p>{survey.body}</p>
            <p className="right">
              Sent On: {new Date(survey.dateSent).toLocaleDateString()}
            </p>
          </div>
          <div className="card-action">
            <a>Yes: {survey.yes}</a>
            <a>No: {survey.no}</a>
          </div>
        </div>
      );
    });

    //
    // <div class="card blue-grey darken-1">
    //   <div class="card-content white-text">
    //     <span class="card-title">Card Title</span>
    //     <p>
    //       I am a very simple card. I am good at containing small bits of
    //       information. I am convenient because I require little markup to use
    //       effectively.
    //     </p>
    //   </div>
    //   <div class="card-action">
    //     <a href="#">This is a link</a>
    //     <a href="#">This is a link</a>
    //   </div>
    // </div>
  }

  render() {
    return <div>{this.renderSurveys()}</div>;
  }
}

function mapStateToProps({ surveys }) {
  return { surveys };
}

export default connect(mapStateToProps, { fetchSurveys })(SurveyList);
