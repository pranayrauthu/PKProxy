import React from "react";
import { connect } from 'react-redux';
import classnames from 'classnames';


class OptionForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            index: 1,
            filterUrl: "",
            redirectUrl: "",
            mode: "ADD"
        }

        this.updateState = this.updateState.bind(this);
        this.addOptionToStore = this.addOptionToStore.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            index: parseInt(nextProps.index)+1,
            filterUrl: nextProps.filterUrl,
            redirectUrl: nextProps.redirectUrl,
            mode: nextProps.mode
        });
    }

    updateState(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    addOptionToStore(e) {
        if(this.state.mode === "EDIT"){
            this.props.updateEntry(this.state);
        }
        else{
            this.props.addEntry(this.state);
        }
        this.props.resetForm();
    }

    render() {
        
        return (
            <div>
                <div className={classnames("mdl-textfield", "mdl-js-textfield")}>
                    <input
                        className={classnames("mdl-textfield__input")}
                        type={"text"} pattern={"-?[0-9]*(\.[0-9]+)?"}
                        id={"opt-index"}
                        readOnly
                        value={this.state.index}
                    />
                    <label className={classnames("mdl-textfield__label")} htmlFor={"sample2"}>Index</label>
                    <span className={classnames("mdl-textfield__error")}>Input is not a number!</span>
                </div>
                <div className={classnames("mdl-textfield", "mdl-js-textfield")}>
                    <input
                        className={classnames("mdl-textfield__input")}
                        type={"text"}
                        id={"filter-url"}
                        onChange={(e) => this.updateState(e)}
                        name={"filterUrl"}
                        value={this.state.filterUrl}
                    />
                    <label className={classnames("mdl-textfield__label")} htmlFor={"filterUrl"}>URL to intercept</label>
                </div>
                <div className={classnames("mdl-textfield", "mdl-js-textfield")}>
                    <input
                        className={classnames("mdl-textfield__input")}
                        type={"text"}
                        id={"redirect-url"}
                        onChange={this.updateState}
                        name={"redirectUrl"}
                        value={this.state.redirectUrl}
                    />
                    <label className={classnames("mdl-textfield__label")} htmlFor={"redirectUrl"}>URL to redirect</label>
                </div>
                <br />
                <button
                    id={"add-entry-btn"}
                    className={classnames("mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent")}
                    onClick={this.addOptionToStore}
                >
                    {this.state.mode} Entry
                </button>
                <p>please check <a href="https://developer.chrome.com/apps/match_patterns" target="_blank">rules</a> for url patterns.</p>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        index: state.formState.index || state.options.length,
        filterUrl: state.formState.filterUrl,
        redirectUrl: state.formState.redirectUrl,
        mode: state.formState.mode
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addEntry: (option) => {
            const optionToSave = {
                filterUrl: option.filterUrl,
                redirectUrl: option.redirectUrl
            };

            /**
             * storage docs - https://developer.chrome.com/extensions/storage
             */
            chrome.storage.sync.get("proxy-urls", function(data) {
                let entries = data["proxy-urls"] || [];
                entries.push(optionToSave);
                chrome.storage.sync.set({
                    "proxy-urls": entries
                }, function () {
                    console.log(`option saved sucessfully...`);
                    dispatch({
                        type: "ADD_OPTION",
                        option: optionToSave
                    });
                });
            });
        },
        updateEntry: (option) => {
            const {filterUrl, redirectUrl} = option;
            let {index} = option;
            index = index - 1;
            dispatch({
                type: "UPDATE_OPTION",
                data: {
                    index,
                    option: {filterUrl, redirectUrl}
                }
            });
        },
        resetForm: function () {
            dispatch({
                type: "RESET_FORM"
            });
        }
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OptionForm)