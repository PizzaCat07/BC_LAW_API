import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {useNavigation} from '@react-navigation/native';

import {getContent} from '../redux/bcContent';
import ContentComp from '../components/Content';

const ContentScreen = props => {
  const navigation = useNavigation();

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

    $('dir')
      .add('document')
      .each(function (i, el) {
        const doc_title = $(el).children('CIVIX_DOCUMENT_TITLE').text();
        const doc_id = $(el).children('CIVIX_DOCUMENT_ID').text();
        const doc_order = $(el).children('CIVIX_DOCUMENT_ORDER').text();
        const doc_type = $(el).children('CIVIX_DOCUMENT_TYPE').text();
        const index = $(el).children('CIVIX_DOCUMENT_INDEX').text();
        // doc_status will only exist if CIVIX_DOCUMENT_STATUS = Repealed
        const doc_status = $(el).children('CIVIX_DOCUMENT_STATUS').text();

        if (!doc_status) {
          dataArray.push({
            title: doc_title,
            id: doc_id,
            order: doc_order,
            type: doc_type,
            index: index,
          });
        }
      });
    dataArray.sort((a, b) => {
      return a.order - b.order;
    });

    setContentArray(dataArray);
  };

  useEffect(() => {
    getContent(props.route.params.id);
  }, [props.route.params.id]);

  //console.log(props.route.params);

  return (
    <View>
      <FlatList
        data={contentArray}
        renderItem={item => (
          <TouchableOpacity
            onPress={() => {
              {
                console.log(item);
              }
              if (item.item.type == 'document') {
                navigation.navigate('Law', {id: item.item.id});
              } else {
                navigation.push('Content', {
                  id: item.item.id,
                  type: item.item.type,
                });
              }
            }}>
            <View>
              <Text style={styles.title}>{item.item.title}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingTop: 10,
    fontSize: 15,
    color: 'black',
  },
});

export default ContentScreen;
