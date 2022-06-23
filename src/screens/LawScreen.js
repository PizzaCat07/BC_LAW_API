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

const LawScreen = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const {width} = useWindowDimensions();
  const ref = useRef();
  const [dropDownIndex, setDropDownIndex] = useState(0);

  const doc_id = props.route.params.id;

  console.log(doc_id);

  const [section, setSection] = useState([]);

  const getLaw = async doc_id => {
    const url = `https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/${doc_id}`;
    const response = await axios.get(url).then(res => res.data);

    const contentArray = [];
    const sectionArray = [];
    const divArray = [];

    const $ = cheerio.load(response);
    $('#content').remove();

    const act = $('#title').find('h2').text();
    const chapter = $('#title').find('h3').text();
    const title = act;
    const part = $('#content').remove().find('.part').text();
    const division = $('#content').remove().find('.division').text();
    props.navigation.setOptions({title}, [title]);

    //console.log(division);

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
    setSection(sectionArray);
  };

  const renderRowNum = section.length;

  useEffect(() => {
    getLaw(doc_id);
  }, [doc_id]);

  const tagsStyles = {
    body: {
      whiteSpace: 'normal',
      color: 'black',
      backgroundColor: 'powderblue',
    },
    h4: {
      color: 'black',
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

export default LawScreen;
