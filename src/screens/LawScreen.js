import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
  Button,
} from 'react-native';
import RenderHTML from 'react-native-render-html';

import {getLaw} from '../redux/bcLaw';
import SectionComp from '../components/Section';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';

const LawScreen = props => {
  const dispatch = useDispatch();

  const division = useSelector(state => state.law.division);
  const title = useSelector(state => state.law.title);
  const part = useSelector(state => state.law.part);

  const {width} = useWindowDimensions();
  const ref = useRef();

  const dropDownIndex = 0;

  useEffect(() => {
    dispatch(getLaw());
  }, [dispatch]);

  const scrollToIndex = dropDownIndex => {
    ref.current.scrollToIndex({animated: true, index: dropDownIndex});
  };

  return (
    <View>
      <View style={styles.header}>
        <RenderHTML contentWidth={width} source={title} />
        <Text style={styles.part}>{part}</Text>
      </View>
      <View>
        <Select
          selectedIndex={dropDownIndex}
          onSelect={index => scrollToIndex(index.row)}
          placeholder="Select Division">
          {division.map((item, index) => {
            return <SelectItem title={item.divTitle} />;
          })}
        </Select>
      </View>
      <FlatList
        ref={ref}
        data={division}
        initialScrollIndex={dropDownIndex}
        renderItem={item => (
          <View>
            <Text style={styles.title}>{item.item.divTitle}</Text>
            <SectionComp divId={item.item.id} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    color: 'blue',
    fontWeight: 'bold',
  },
  part: {
    fontSize: 18,
    color: 'orange',
    fontWeight: 'bold',
    justifyContent: 'center',
    alignContent: 'center',
  },
  header: {
    justifyContent: 'center',
    alignContent: 'center',
    paddingBottom: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    width: 100,
  },
});

export default LawScreen;
