import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  SectionList,
  FlatList,
} from 'react-native';
import {WebView} from 'react-native-webview';
import {parse, XMLParser} from 'fast-xml-parser';

export default function App() {
  const [html, setHtml] = useState([]);
  const [div, setDiv] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const url =
    'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_03';

  const parser = new XMLParser({
    removeNSPrefix: true,
    ignoreAttributes: true,
    ignoreDeclaration: true,
  });

  const fetchApiCall = () => {
    setLoading(true);
    fetch(url)
      .then(response => response.text())
      .then(data => {
        setHtml(data);

        setLoading(false);
      });
  };

  useEffect(() => {
    fetchApiCall();
  }, []);

  //console.log(isLoading);
  //console.log(xml.content.part.text);
  //console.log(html);

  if (isLoading === true) {
    return (
      <View style={styles.sectionContainer}>
        <Text>LOADING</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.sectionContainer}>
        <WebView
          source={{
            uri: 'https://www.bclaws.gov.bc.ca/civix/document/id/complete/statreg/11025_03',
            method: 'get',
          }}
          scalesPageToFit={false}
        />
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
