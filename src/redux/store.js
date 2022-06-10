import {configureStore} from '@reduxjs/toolkit';

import bcLawReducer from './bcLaw';
import bcContentReducer from './bcContent';

const store = configureStore({
  reducer: {
    law: bcLawReducer,
    //content: bcContentReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export default store;
