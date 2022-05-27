import React, {useEffect, useState} from 'react';
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
import {current} from '@reduxjs/toolkit';

const LawScreen = props => {
  const dispatch = useDispatch();

  const division = useSelector(state => state.law.division);
  const title = useSelector(state => state.law.title);
  const part = useSelector(state => state.law.part);

  const {width} = useWindowDimensions();

  useEffect(() => {
    dispatch(getLaw());
  }, [dispatch]);

  const [index, setIndex] = useState(0);

  return (
    <View>
      <View>
        <Button title="up" onPress={() => setIndex(index + 1)} />
        <Button title="down" onPress={() => setIndex(index - 1)} />
        <Text>{index}</Text>
      </View>
      <View style={styles.header}>
        <RenderHTML contentWidth={width} source={title} />
        <Text style={styles.part}>{part}</Text>
      </View>
      <FlatList
        data={division}
        initialScrollIndex={index}
        renderItem={(item, index) => (
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
