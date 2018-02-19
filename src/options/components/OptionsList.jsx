import React from 'react';
import { connect } from 'react-redux';
import { Grid } from 'rmwc/Grid';
import PropTypes from 'prop-types';
import uuidv1 from 'uuid/v1';

import Option from './Option';

class OptionsList extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.props.loadOptions();
  }

  loadOptions() {
    return this.props.options.map((option, i) => (<Option
      filterUrl={option.filterUrl}
      redirectUrl={option.redirectUrl}
      key={uuidv1()}
      index={i}
    />));
  }

  handleClick(e) {
    e.preventDefault();
    const { target } = e;

    if (target.dataset.type === 'delete') {
      this.props.deleteOption(target.parentElement.dataset.index);
    }

    if (target.dataset.type === 'edit') {
      const option = this.props.options
        .filter((opt, i) => i.toString() === target.parentElement.dataset.index)[0];
      option.index = target.parentElement.dataset.index;
      this.props.editOption(option);
    }
  }

  render() {
    return (
      <div
        id="options-table"
        role="presentation"
        onClick={this.handleClick}
      >
        <Grid>{this.loadOptions()}</Grid>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  options: state.options || [],
});

const mapDispatchToProps = dispatch => ({
  deleteOption(index) {
    chrome.storage.sync.get('proxy-urls', (data) => {
      let options = data['proxy-urls'] || [];
      options = options.filter((o, i) => !(i.toString() === index));
      chrome.storage.sync.set({ 'proxy-urls': options }, () => {
        dispatch({
          type: 'DELETE_OPTION',
          index,
        });
        dispatch({
          type: 'NOTIFY',
          data: {
            message: 'rule deleted successfully.',
            timeout: 2000,
            show: true,
          },
        });
      });
    });
  },
  editOption(option) {
    const { index, filterUrl, redirectUrl } = option;
    dispatch({
      type: 'UPDATE_FORM',
      data: {
        index, filterUrl, redirectUrl, mode: 'EDIT',
      },
    });
  },
  loadOptions() {
    chrome.storage.sync.get('proxy-urls', (data) => {
      const options = data['proxy-urls'] || [];
      options.forEach((option) => {
        dispatch({
          type: 'ADD_OPTION',
          option,
        });
      });
    });
  },
});

OptionsList.propTypes = {
  loadOptions: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  deleteOption: PropTypes.func.isRequired,
  editOption: PropTypes.func.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OptionsList);
