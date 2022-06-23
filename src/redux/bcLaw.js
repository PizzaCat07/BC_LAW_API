import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const getLaw = createAsyncThunk('bcLaw/getLaw', async Document_Id => {
  const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${Document_Id}`;
  //const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02057_08#part7`;
  //const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/02014_01`;
  const html = await axios.get(url).then(res => res.data);
  return html;
});

const lawSlice = createSlice({
  name: 'bcLaw',
  initialState: {
    division: [],
    content: [],
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
      const contentArray = [];
      const sectionArray = [];
      const divArray = [];

      const html = action.payload;
      const $ = cheerio.load(html);
      $('#content').remove();

      //const title = {html: $('#title').html()};
      const act = $('#title').find('h2').text();
      const chapter = $('#title').find('h3').text();
      const title = act;
      const part = $('#content').remove().find('.part').text();
      const division = $('#content').remove().find('.division').text();

      if (!division) {
        divArray.push({
          id: 1,
          divTitle: '',
        });

        $('.section').each(function (i, el) {
          const content = $(el).find('h4').text();
          contentArray.push({
            id: i,
            title: content,
          });

          const id = $(el).children('p').attr('id');

          const section = $(el).html();
          sectionArray.push({
            id: id,
            divId: '1',
            divTitle: '',
            html: section,
          });
        });
      } else {
        $('.division').each(function (i, el) {
          const divTitle = $(el).text();
          const divHtml = $(el).html();
          const divId = $(el).attr('id');

          contentArray.push({
            id: i,
            title: divTitle,
          });

          divArray.push({
            id: divId,
            divTitle: divTitle,
          });

          sectionArray.push({
            id: divId,
            divId: divId,
            divTitle: divTitle,
            html: divHtml,
          });

          $(this)
            //until next class = division and all class = section between them
            .nextUntil('.division', '.section')
            .each(function (i, el) {
              const content = $(el).find('h4').text();

              contentArray.push({
                id: i,
                title: content,
              });

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
      }

      //console.log(contentArray);
      //console.log(divArray);
      //console.log(sectionArray);

      //for each class = division get id and title

      //console.log(sectionArray);
      state.division = divArray;
      state.content = contentArray;
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
