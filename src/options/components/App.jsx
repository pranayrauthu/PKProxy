import React from 'react';
import { connect } from 'react-redux';
import { Typography } from 'rmwc/Typography';
import PropTypes from 'prop-types';

import OptionsList from './OptionsList';
import OptionForm from './OptionForm';
import Notifier from './Notifier';


const App = props => (
  <main>
    <Typography use="headline">PKProxy</Typography>
    <OptionForm />
    <hr />
    <OptionsList />
    <Notifier show={props.showNotification} />
  </main>
);

App.propTypes = {
  showNotification: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  showNotification: state.notification.show,
});

export default connect(mapStateToProps)(App);
