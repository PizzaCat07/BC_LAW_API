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
  Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import RenderHTML from 'react-native-render-html';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import * as cheerio from 'cheerio';

const TestScreen = props => {
  const navigation = useNavigation();

  function H1Renderer({TDefaultRenderer, ...props}) {
    const onPress = () => Alert.alert('pressed!');
    return <TDefaultRenderer {...props} onPress={onPress} />;
  }

  const tagsStyles = {
    article: {
      marginHorizontal: 10,
    },
  };

  const source = {
    html: `
  <article>
    <h1>Press me!</h1>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
      do eiusmod tempor incididunt ut labore et dolore magna aliqua.
      Ut enim ad minim veniam.<a> Anchor Test </a><br>
      
      <a href="/civix/document/id/complete/statreg/08028_01"><em>Public Health Act</em></a>
    </p>
  </article>
  `,
  };

  const renderers = {
    h1: H1Renderer,
    a: H1Renderer,
  };

  const {width} = useWindowDimensions();

  return (
    <View>
      <RenderHTML
        contentWidth={width}
        tagsStyles={tagsStyles}
        source={source}
        /* renderers={renderers} */
        renderersProps={{
          a: {
            onPress: (evt, href, htmlAttribs, target) => {
              const doc_id = href.split('/').pop();
              console.log(doc_id);
              navigation.navigate('Law', {id: doc_id});
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    fontSize: 15,
    color: 'black',
  },
});

export default TestScreen;
