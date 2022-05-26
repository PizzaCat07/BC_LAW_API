import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const getUsers = createAsyncThunk(
  'users/getUsers',
  async (dispatch, getState) => {
    const res = await axios('https://jsonplaceholder.typicode.com/users').then(
      res => res.data,
    );
    return res;
  },
);

const usersSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
    username: [],
    status: null,
  },
  extraReducers: {
    [getUsers.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getUsers.fulfilled]: (state, action) => {
      state.status = 'success';

      const data = action.payload;
      const name = [];
      const username = [];

      for (let x in data) {
        name.push(data[x].name);
        username.push(data[x].username);
      }

      state.users = name;
      state.username = username;
    },
    [getUsers.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default usersSlice.reducer;
