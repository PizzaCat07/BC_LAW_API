import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import * as cheerio from 'cheerio';

import Division from '../models/division';
import Section from '../models/section';

export const getLaw = createAsyncThunk(
  'bcLaw/getLaw',
  async (dispatch, getState) => {
    const url =
      'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_05';
    const html = await axios.get(url).then(res => res.data);
    return html;
  },
);

const lawSlice = createSlice({
  name: 'bcLaw',
  initialState: {
    division: [],
    section: [],
    status: null,
  },
  extraReducers: {
    [getLaw.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getLaw.fulfilled]: (state, action) => {
      state.status = 'success';
      const divArray = [];
      const sectionArray = [];
      const html = action.payload;
      const $ = cheerio.load(html);

      //for each class = division get id and title
      $('.division').each(function (i, el) {
        const divTitle = $(el).text();
        const divId = $(el).attr('id');

        divArray.push(new Division(divId, divTitle));

        $(this)
          //until next class = division and all class = section between them
          .nextUntil('.division', '.section')
          .each(function (i, el) {
            const section = $(el).html();
            //get attr = id from first p tag of children
            const id = $(el).children('p').attr('id');

            //console.log(id, divID, divTitle);
            sectionArray.push(new Section(id, divId, divTitle, section));
          });
      });
      state.division = divArray;
      state.section = sectionArray;
    },
    [getLaw.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default lawSlice.reducer;
