import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import axios from 'axios';
import * as cheerio from 'cheerio';

const ContentComp = props => {
  const [contentArray, setContentArray] = useState([]);

  const getContent = async Document_Id => {
    if (!Document_Id) {
      Document_Id = '';
    }
    const response = await axios
      .get(
        `https://www.bclaws.gov.bc.ca/civix/content/complete/statreg/${Document_Id}`,
      )
      .then(res => res.data);

    let dataArray = [];
    const $ = cheerio.load(response, {xmlMode: true});

    $('dir').each(function (i, el) {
      const doc_title = $(el).children('CIVIX_DOCUMENT_TITLE').text();
      const doc_id = $(el).children('CIVIX_DOCUMENT_ID').text();
      const doc_order = $(el).children('CIVIX_DOCUMENT_ORDER').text();

      dataArray.push({
        title: doc_title,
        id: doc_id,
        order: doc_order,
      });
    });
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });
    //console.log(dataArray);
    setContentArray(dataArray);
  };

  useEffect(() => {
    getContent();
  }, []);

  //console.log(contentArray);

  return (
    <View>
      <FlatList
        data={contentArray}
        renderItem={item => <Text>{item.item.title}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default ContentComp;
