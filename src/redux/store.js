import {configureStore} from '@reduxjs/toolkit';

import bcLawReducer from './bcLaw';

const store = configureStore({
  reducer: {
    law: bcLawReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export default store;
