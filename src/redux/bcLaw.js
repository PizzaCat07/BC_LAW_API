import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import * as cheerio from 'cheerio';

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
    title: '',
    part: '',
    status: '',
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

      const title = {html: $('#title').html()};
      const part = $('.part').text();

      //console.log(title);

      //for each class = division get id and title
      $('.division').each(function (i, el) {
        const divTitle = $(el).text();
        const divId = $(el).attr('id');

        divArray.push({
          id: divId,
          divTitle: divTitle,
        });

        $(this)
          //until next class = division and all class = section between them
          .nextUntil('.division', '.section')
          .each(function (i, el) {
            const section = $(el).html();
            //get attr = id from first p tag of children
            const id = $(el).children('p').attr('id');

            //console.log(id, divID, divTitle);
            sectionArray.push({
              id: id,
              divId: divId,
              divTitle: divTitle,
              html: section,
            });
          });
      });

      //console.log(sectionArray);
      state.division = divArray;
      state.section = sectionArray;
      state.title = title;
      state.part = part;
    },
    [getLaw.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default lawSlice.reducer;
