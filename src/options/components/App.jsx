import React from "react";
import OptionsList from "./OptionsList";
import OptionForm from './OptionForm';

import { Typography } from 'rmwc/Typography';

const App = (props) => {
    return (
        <main>
            <Typography use="headline">PKProxy</Typography>
            <OptionForm />
            <hr/>
            <OptionsList />
        </main>
    )
}

export default App;