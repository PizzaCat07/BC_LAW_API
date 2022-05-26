import {configureStore} from '@reduxjs/toolkit';
import userReducer from './api';
import bcLawReducer from './bcLaw';

const store = configureStore({
  reducer: {
    users: userReducer,
    law: bcLawReducer,
  },
});

export default store;
