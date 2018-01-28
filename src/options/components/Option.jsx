import React from "react";


const Option = (props) => {
    return (
        <div>
            <div>{props.filterUrl}</div>
            <div>{props.redirectUrl}</div>
            <div data-index={props.index}>
                <a href='#' data-type="edit">edit</a> |
                <a href='#' data-type="delete">delete</a>
            </div>
        </div>
    )
}

export default Option;