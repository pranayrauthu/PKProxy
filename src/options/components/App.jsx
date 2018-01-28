import React from "react";
import OptionsList from "./OptionsList";
import OptionForm from './OptionForm';

const App = (props) => {
    return (
        <main>
            <h3>PK Proxy</h3>
            <OptionForm />
            <hr/>
            <OptionsList />
        </main>
    )
}

export default App;