import React from 'react';
import PropTypes from 'prop-types';

import { Elevation } from 'rmwc/Elevation';
import { GridCell } from 'rmwc/Grid';

const Option = props => (
  <GridCell span="4">
    <Elevation z={5}>
      <div>{props.filterUrl}</div>
      <div>{props.redirectUrl}</div>
      <div data-index={props.index}>
        <span data-type="edit">edit</span> | <span data-type="delete">delete</span>
      </div>
    </Elevation>
  </GridCell>
);

Option.propTypes = {
  filterUrl: PropTypes.string.isRequired,
  redirectUrl: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
};

export default Option;
