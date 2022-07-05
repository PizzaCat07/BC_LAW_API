import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Button,
  SectionList,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import {
  IndexPath,
  Layout,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';
import axios from 'axios';
import * as cheerio from 'cheerio';
import {useNavigation} from '@react-navigation/native';

import {getLaw} from '../redux/bcLaw';
import SectionComp from '../components/Section';
import {index} from 'cheerio/lib/api/traversing';

const LawSearchScreen = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const {width} = useWindowDimensions();
  const ref = useRef();
  const [dropDownIndex, setDropDownIndex] = useState(0);

  const doc_id = props.route.params.id;
  const searchTerm = props.route.params.searchTerm;
  console.log(doc_id, searchTerm);

  const [section, setSection] = useState([]);
  const [refresh, setRefresh] = useState(false);

  const getLawSearch = async (doc_id, searchTerm) => {
    const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${doc_id}/search/'${searchTerm}'`;
    const response = await axios.get(url).then(res => res.data);
    console.log(url);

    const contentArray = [];
    const sectionArray = [];

    const $ = cheerio.load(response);
    $('#contents,.copyright').remove();

    const act = $('#title').find('h2').text();
    const chapter = $('#title').find('h3').text();
    const title = act;
    $('.part')
      .wrapInner((i, el) => `<h2>${el}</h2>`)
      .html();
    const part = $('.part').html();

    $('.division')
      .wrapInner((i, el) => `<h3>${el}</h3>`)
      .html();
    const division = $('.division').html();

    props.navigation.setOptions({title}, [title]);

    $('#title')
      .nextAll()
      .each(function (i, el) {
        const id = $(el).children('p').attr('id');
        const section = $(el).html();
        console.log(id);
        sectionArray.push({
          id: i,
          html: section,
        });
        setSection(sectionArray);
      });
    setRefresh(true);
  };

  const renderRowNum = section.length;

  useEffect(() => {
    getLawSearch(doc_id, searchTerm);
  }, [doc_id]);

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      backgroundColor: 'powderblue',
      fontSize: 14,
    },
    h2: {
      color: 'red',
      fontSize: 18,
      textAlign: 'center',
    },
    h3: {
      color: 'green',
      fontSize: 16,
      textAlign: 'center',
    },
    h4: {
      color: 'blue',
      fontSize: 14,
    },
  };

  const classesStyles = {
    ep_hit: {
      backgroundColor: 'yellow',
    },
  };

  if (!loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        <FlatList
          data={section}
          keyExtractor={item => item.key}
          renderItem={(item, index) => (
            <View>
              {/* <Text style={styles.text}>{item.item.id}</Text>
              <Text>{item.index}</Text> */}
              <RenderHTML
                contentWidth={width}
                source={item.item}
                tagsStyles={tagsStyles}
                classesStyles={classesStyles}
                renderersProps={{
                  a: {
                    onPress: (evt, href) => {
                      const doc_id = href.split('/').pop();
                      console.log(doc_id);
                      navigation.push('Law', {id: doc_id});
                    },
                  },
                }}
              />
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  text: {color: 'red'},
  title: {
    fontSize: 15,
    color: 'blue',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignContent: 'center',
  },
  part: {
    fontSize: 12,
    color: 'orange',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    height: '10%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
  },
  listContainer: {
    height: '100%',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default LawSearchScreen;
