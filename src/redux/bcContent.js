import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const getContent = createAsyncThunk(
  'bcContent/getContent',

  async (Document_Id, dispatch) => {
    if (!Document_Id) {
      Document_Id = '';
    }
    const response = await axios
      .get(
        `https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/${Document_Id}`,
      )
      .then(res => res.data);

    return response;
  },
);

const contentSlice = createSlice({
  name: 'bcContent',
  initialState: {
    content: [],
    status: '',
  },
  extraReducers: {
    [getContent.pending]: (state, action) => {
      state.status = 'loading';
    },
    [getContent.fulfilled]: (state, action) => {
      state.status = 'success';

      const apiData = [];
      const data = action.payload;
      const $ = cheerio.load(data, {xmlMode: true});

      $('dir').each(function (i, el) {
        const doc_title = $(el).children('CIVIX_DOCUMENT_TITLE').text();
        const doc_id = $(el).children('CIVIX_DOCUMENT_ID').text();
        const doc_order = $(el).children('CIVIX_DOCUMENT_ORDER').text();
        const doc_status = $(el).children('CIVIX_DOCUMENT_STATUS').text();

        if (doc_status == null) {
          apiData.push({
            title: doc_title,
            id: doc_id,
            order: doc_order,
          });
        }
      });

      //console.log(apiData);

      state.content = apiData;
    },
    [getContent.rejected]: (state, action) => {
      state.status = 'failed';
    },
  },
});

export default contentSlice.reducer;
