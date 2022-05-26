import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, StyleSheet, Text, FlatList} from 'react-native';

import {getUsers} from '../redux/api';
import {getLaw} from '../redux/bcLaw';
import SectionComp from '../components/Section';

const LawScreen = props => {
  const dispatch = useDispatch();
  const {users} = useSelector(state => state.users);
  const division = useSelector(state => state.law.division);

  const divId = 'd2e6858';

  useEffect(() => {
    dispatch(getUsers());
    dispatch(getLaw());
  }, [dispatch]);

  return (
    <View>
      <FlatList
        data={division}
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
});

export default LawScreen;
