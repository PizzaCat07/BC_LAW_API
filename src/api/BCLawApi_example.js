import axios from 'axios';
import * as cheerio from 'cheerio';

import Division from '../models/division';
import Section from '../models/section';

export const fetchLaw = () => {
  const url =
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_05';
  axios(url).then(response => {
    const divArray = [];
    const sectionArray = [];
    const html = response.data;
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
  });
};
