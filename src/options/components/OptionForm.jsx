import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TextField } from 'rmwc/TextField';
import { Button } from 'rmwc/Button';

class OptionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      filterUrl: '',
      redirectUrl: '',
      mode: 'ADD',
    };

    this.updateState = this.updateState.bind(this);
    this.addOptionToStore = this.addOptionToStore.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      index: parseInt(nextProps.index) + 1,
      filterUrl: nextProps.filterUrl,
      redirectUrl: nextProps.redirectUrl,
      mode: nextProps.mode,
    });
  }

  updateState(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  addOptionToStore() {
    if (!this.validUrlPattern()) {
      // TODO: show proper error message
      this.props.notify({
        message: 'plese enter valid url pattern',
        timeout: 2000,
      });
      return;
    }

    if (this.state.mode === 'EDIT') {
      this.props.updateEntry(this.state);
    } else {
      this.props.addEntry(this.state);
    }
    this.props.resetForm();
  }

  validUrlPattern() {
    let isValid = true;
    const urlPattern = this.state.filterUrl.split('://');
    if (urlPattern.length < 2) {
      return false;
    }
    const scheme = urlPattern[0];
    let host = urlPattern.filter((v, i) => i > 0).join('://');
    host = host.split('/');
    if (host.length < 2) {
      return false;
    }
    host = host[0];
    /**
     * validate scheme
     *
     * https://jex.im/regulex/#!flags=&re=(%5E%5C*%24)%7C(%5Ehttp%24)%7C(%5Ehttps%24)%7C(%5Efile%24)%7C(%5Eftp%24)
     */
    isValid = isValid && new RegExp('(^\\*$)|(^http$)|(^https$)|(^file$)|(^ftp$)').test(scheme);
    /**
     * validate host
     *
     * https://jex.im/regulex/#!flags=&re=(%5E%5C*%24)%7C(%5E%5C*%5C.%5B%5E%5C%2F*%5D%2B%24)%7C(%5E((%5Ba-zA-Z0-9%5D%7C%5Ba-zA-Z0-9%5D%5Ba-zA-Z0-9%5C-%5D*%5Ba-zA-Z0-9%5D)%5C.)*(%5BA-Za-z0-9%5D%7C%5BA-Za-z0-9%5D%5BA-Za-z0-9%5C-%5D*%5BA-Za-z0-9%5D)%24)
     */
    isValid = isValid && new RegExp('(^\\*$)|(^\\*\\.[^\\/*]+$)|(^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\\-]*[a-zA-Z0-9])\\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\\-]*[A-Za-z0-9])$)').test(host);
    return isValid;
  }

  render() {
    return (
      <div>
        <TextField
          label="Index"
          value={this.state.index}
          disabled
        />
        <TextField
          name="filterUrl"
          onChange={this.updateState}
          value={this.state.filterUrl}
          label="URL pattern to intercept"
        />
        <TextField
          name="redirectUrl"
          onChange={this.updateState}
          value={this.state.redirectUrl}
          label="URL to redirect"
        />
        <br />
        <Button raised onClick={this.addOptionToStore}>
          {this.state.mode} Entry
        </Button>
        <p>please check <a href="https://developer.chrome.com/apps/match_patterns" target="_blank" rel="noopener noreferrer">rules</a> for url patterns.</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  index: state.formState.index || state.options.length,
  filterUrl: state.formState.filterUrl,
  redirectUrl: state.formState.redirectUrl,
  mode: state.formState.mode,
});

const mapDispatchToProps = dispatch => ({
  addEntry(option) {
    const optionToSave = {
      filterUrl: option.filterUrl,
      redirectUrl: option.redirectUrl,
    };

    /**
     * storage docs - https://developer.chrome.com/extensions/storage
     */
    chrome.storage.sync.get('proxy-urls', (data) => {
      const entries = data['proxy-urls'] || [];
      entries.push(optionToSave);
      chrome.storage.sync.set({
        'proxy-urls': entries,
      }, () => {
        dispatch({
          type: 'ADD_OPTION',
          option: optionToSave,
        });
        dispatch({
          type: 'NOTIFY',
          data: {
            message: 'rule saved successfully.',
            timeout: 2000,
            show: true,
          },
        });
      });
    });
  },
  updateEntry(option) {
    const { filterUrl, redirectUrl } = option;
    let { index } = option;
    index -= 1;
    index = index.toString();
    dispatch({
      type: 'UPDATE_OPTION',
      data: {
        index,
        option: { filterUrl, redirectUrl },
      },
    });
    dispatch({
      type: 'NOTIFY',
      data: {
        message: 'rule saved successfully.',
        timeout: 2000,
        show: true,
      },
    });
  },
  resetForm() {
    dispatch({
      type: 'RESET_FORM',
    });
  },
  notify({ message, timeout }) {
    dispatch({
      type: 'NOTIFY',
      data: {
        message,
        timeout,
        show: true,
      },
    });
  },
});

OptionForm.propTypes = {
  updateEntry: PropTypes.func.isRequired,
  addEntry: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired,
  notify: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OptionForm);
