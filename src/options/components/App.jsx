import React from 'react';
import { Typography } from 'rmwc/Typography';

import OptionsList from './OptionsList';
import OptionForm from './OptionForm';


const App = () => (
  <main>
    <Typography use="headline">PKProxy</Typography>
    <OptionForm />
    <hr />
    <OptionsList />
  </main>
);

export default App;
