import React from "react";

import { Elevation } from 'rmwc/Elevation';
import { GridCell } from 'rmwc/Grid';

const Option = (props) => {
    return (
        <GridCell span="4">
            <Elevation z={5}>
                <div>{props.filterUrl}</div>
                <div>{props.redirectUrl}</div>
                <div data-index={props.index}>
                    <a href='#' data-type="edit">edit</a> | <a href='#' data-type="delete">delete</a>
                </div>
            </Elevation>
        </GridCell>
    )
}

export default Option;