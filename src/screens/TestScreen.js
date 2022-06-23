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
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';

const TestScreen = props => {
  return (
    <View>
      <Text></Text>
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
