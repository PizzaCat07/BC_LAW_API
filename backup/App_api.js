import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SectionList,
  FlatList,
} from 'react-native';

import {parse, XMLParser} from 'fast-xml-parser';

export default function App() {
  //declare states for all xml data and division data
  const [xml, setXml] = useState([]);
  const [div, setDiv] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const url =
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_03/xml';

  const parser = new XMLParser({
    removeNSPrefix: true,
    ignoreAttributes: false,
    ignoreDeclaration: true,
  });

  const fetchApiCall = () => {
    setLoading(true);
    console.log('\n\n\n\nBREAK');
    fetch(url)
      .then(response => response.text())
      .then(data => {
        //console.log(data);

        // set states with xml data
        const xml = parser.parse(data);
        const content = xml.act.content.part.division;
        const title = xml.act.title;

        setXml(xml.act);
        setDiv(xml.act.content.part.division);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApiCall();
  }, []);

  const divisonArray = div.map(index => ({
    id: index['@_id'],
    num: index.num,
    text: index.text,
    section: index.section.forEach(item => console.log(item)),
  }));

  console.log(divisonArray);

  //console.log(isLoading);
  //console.log(xml.content.part.text);
  //console.log(div);

  if (isLoading === true) {
    return (
      <View style={styles.sectionContainer}>
        <Text>LOADING</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.testing}>
          <Text>App Screen</Text>
          <Button title="Test" onPress={() => fetchApiCall()} />
        </View>
        <View style={styles.actContainer}>
          <Text>{xml.title} </Text>
          <Text>Chapter: {xml.chapter}</Text>
          <Text>Year Enacted: {xml.yearenacted}</Text>
          <Text>Year Assented: {xml.assentedto}</Text>
        </View>
        <View style={styles.partContainer}>
          <Text style={styles.partText}>
            Part {xml.content.part.num} - {xml.content.part.text}{' '}
          </Text>
        </View>
        <View>
          <FlatList
            data={divisonArray}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View>
                <View>
                  <Text>
                    Division {item.num} - {item.text}
                  </Text>
                </View>
                <View></View>
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
});
