import React from 'react';
import { connect } from 'react-redux';
import { Snackbar } from 'rmwc/Snackbar';
import PropTypes from 'prop-types';

const Notifier = props => (
  <Snackbar
    show={props.snackbarIsOpen}
    onHide={props.onHide}
    message={props.message}
    timeout={props.timeout}
  />
);

Notifier.propTypes = {
  snackbarIsOpen: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  timeout: PropTypes.number.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  snackbarIsOpen: ownProps.show || state.notification.show,
  message: state.notification.message,
  timeout: state.notification.timeout,
});

const mapDispatchToProps = dispatch => ({
  onHide: () => {
    dispatch({
      type: 'RESET',
    });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Notifier);
