import React from 'react';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import _ from 'lodash';
import SurveyList from './surveys/SurveyList';

const Dashboard = () => {
  // renderSurveys() {
  //   console.log(this.props.surveys);
  //   return _.map(this.props.surveys, survey => {
  //     return (
  //       <div key={survey._id}>
  //         <h4>Survey Title:</h4>
  //         {survey.title}
  //       </div>
  //     );
  //   });
  // }

  // render() {
  return (
    <div>
      <SurveyList />
      <div className="fixed-action-btn">
        <Link to="/surveys/new" className="btn-floating btn-large red">
          <i className="material-icons">add</i>
        </Link>
      </div>
    </div>
  );
  // }
};
export default Dashboard;
