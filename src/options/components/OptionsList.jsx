import React from 'react';
import { connect } from 'react-redux';

import Option from './Option';


class OptionsList extends React.Component {

    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.props.loadOptions();
    }

    loadOptions() {
        return this.props.options.map((option, i) => {
            return <Option
                filterUrl={option.filterUrl}
                redirectUrl={option.redirectUrl}
                key={i}
                index={i}
            />
        });
    }

    handleClick(e) {
        e.preventDefault();
        const target = e.target;
        
        if(target.dataset.type === "delete"){
            this.props.deleteOption(target.parentElement.dataset.index);
        }

        if(target.dataset.type === "edit"){
            const option = this.props.options.filter(function (opt, i) {
                return i == target.parentElement.dataset.index
            })[0];
            option.index = target.parentElement.dataset.index;
            this.props.editOption(option);
        }
    }

    render() {
        return (
            <div id={"options-table"} onClick={this.handleClick}>
                {this.loadOptions()}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        options: state.options || []
    }
}

const mapDispatchToProps = dispatch => {
    return {
        deleteOption: function (index) {
            chrome.storage.sync.get('proxy-urls', function (data) {
                let options = data['proxy-urls'] || [];
                options = options.filter((o, i) => !(i==index));
                chrome.storage.sync.set({'proxy-urls': options}, function () {
                    dispatch({
                        type: "DELETE_OPTION",
                        index: index
                    });
                    console.log('deleted succesfully');
                })
            });
        },
        editOption: function (option) {
            const {index, filterUrl, redirectUrl} = option;
            dispatch({
                type: "UPDATE_FORM",
                data: {index, filterUrl, redirectUrl, mode: "EDIT"}
            });
        },
        loadOptions: function () {
            chrome.storage.sync.get('proxy-urls', function (data) {
                const options = data['proxy-urls'] || [];
                options.forEach(option => {
                    dispatch({
                        type: "ADD_OPTION",
                        option: option
                    });
                });
            });
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OptionsList);