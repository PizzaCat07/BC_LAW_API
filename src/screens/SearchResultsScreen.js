import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';

const SearchResultsScreen = props => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const [searchResultArray, setSearchResultArray] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const getSearchResults = async searchTerm => {
    console.log('search');
    const url = `http://www.bclaws.ca/civix/search/complete/fullsearch?q=${searchTerm}&s=0&e=20&nFrag=5&lFrag=100`;
    const response = await axios.get(url).then(res => res.data);

    let dataArray = [];
    let html = '';
    const $ = cheerio.load(response, {xmlMode: true});

    function onlyNumbers(str) {
      return /^[0-9_]+$/.test(str);
    }

    $('doc').each(function (i, el) {
      html = '';
      const doc_title = $(el).children('CIVIX_DOCUMENT_TITLE').text();
      const doc_id = $(el).children('CIVIX_DOCUMENT_ID').text();
      const doc_type = $(el).children('CIVIX_DOCUMENT_TYPE').text();
      // doc_status will only exist if CIVIX_DOCUMENT_STATUS = Repealed
      const doc_status = $(el).children('CIVIX_DOCUMENT_STATUS').text();
      const text = $(el).children('frag').text();
      const textHtml = $(el).children('frag').html();

      if (!doc_status && onlyNumbers(doc_id)) {
        $(el)
          .children('frag')
          .each(function (i, el) {
            const fragHtml = $(el).html();
            html = html.concat(fragHtml, '<br>');
          });

        dataArray.push({
          title: doc_title,
          id: doc_id,
          type: doc_type,
          text: text,
          html: html,
        });
      }

      setSearchResultArray(dataArray);
      //console.log(dataArray);
    });
    //console.log(searchResultArray);
  };

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      backgroundColor: 'lightgray',
    },
    b: {
      backgroundColor: 'yellow',
    },
  };

  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={setSearchTerm}
        value={searchTerm}
        style={styles.input}
      />
      <Button title="Search" onPress={() => getSearchResults(searchTerm)} />
      <View>
        <FlatList
          style={styles.listContainer}
          data={searchResultArray}
          renderItem={item => (
            <View style={styles.result}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('LawSearch', {
                    id: item.item.id,
                    searchTerm: searchTerm,
                  });
                }}>
                <Text>{item.item.id}</Text>
                <Text style={styles.title}>{item.item.title}</Text>
                <RenderHTML
                  contentWidth={width}
                  source={item.item}
                  tagsStyles={tagsStyles}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  result: {paddingTop: 10},
  container: {flex: 1},
  input: {backgroundColor: 'lightgreen'},
  title: {fontWeight: 'bold', fontSize: 16, color: 'green'},
  listContainer: {height: '90%'},
});

export default SearchResultsScreen;
