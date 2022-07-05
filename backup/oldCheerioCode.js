if (!division && !part) {
  console.log('no part or division');

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
      html: section,
    });
  });
} else if (!division && part) {
  console.log('no div, has part');

  $('#title')
    .nextAll()
    .each(function (i, el) {
      const id = $(el).children('p').attr('id');
      const section = $(el).html();
      sectionArray.push({
        id: id,
        html: section,
      });
    });

  /*  const partTitle = $('.part').html();
        console.log('[part title', partTitle); */
} else {
  console.log('div and part');

  $('#title')
    .nextAll()
    .each(function (i, el) {
      const id = $(el).children('p').attr('id');
      const section = $(el).html();
      sectionArray.push({
        id: id,
        html: section,
      });
    });
}
setSection(sectionArray);
