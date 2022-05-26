import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  useWindowDimensions,
  FlatList,
  ScrollView,
  SectionList,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import axios from 'axios';
import * as cheerio from 'cheerio';

import Division from './src/models/division';
import Section from './src/models/section';

export default function App() {
  //declare states for all xml data and division data
  const [divTitle, setDivTitle] = useState([]);
  const [html, setHtml] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const url =
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_05';

  const fetchApiCall = () => {
    let lawArray = [];
    let titleArray = [];

    setLoading(true);
    axios(url).then(response => {
      const html = response.data;
      const $ = cheerio.load(html);

      $('.division').each(function (i, el) {
        const divTitle = $(el).text();
        const divId = $(el).attr('id');

        titleArray.push(new Division(divId, divTitle));

        const sectionCount = $(this)
          .nextUntil('.division', '.section')
          .each(function (i, el) {
            const section = $(el).html();
            const id = $(el).children('p').attr('id');

            //console.log(id, divID, divTitle);
            lawArray.push(new Section(id, divId, divTitle, section));
          });
      });

      setDivTitle(titleArray);
      setHtml(lawArray);
      setLoading(false);
    });
  };

  const {width} = useWindowDimensions();
  //console.log(html);

  let divs = divTitle;
  let sections = html;
  //console.log(source);

  if (isLoading === true) {
    return (
      <View style={styles.sectionContainer}>
        <Text>LOADING</Text>
        <Button title={'Test'} onPress={() => fetchApiCall()} />
      </View>
    );
  } else {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.testing}>
          <Text>App Screen</Text>
          <Button title="Test" onPress={() => fetchApiCall()} />
        </View>
        <View>
          <FlatList
            data={sections}
            keyExtractor={item => item.id}
            renderItem={item => (
              <View>
                <Text style={styles.divTitle}>{item.item.divTitle}</Text>
                <RenderHTML contentWidth={width} source={item.item} />
              </View>
            )}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
  },
  testing: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  actContainer: {},
  partContainer: {
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  partText: {fontSize: 18, fontWeight: 'bold'},
  divisionContainer: {},
  divTitle: {
    fontSize: 24,
    color: 'blue',
  },
});
