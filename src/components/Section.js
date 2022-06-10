import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import {useSelector} from 'react-redux';

import RenderHTML from 'react-native-render-html';

const SectionComp = ({divId}) => {
  const {width} = useWindowDimensions();

  const section = useSelector(state => state.law.section);
  const divSection = section.filter(item => item.divId === divId);

  return (
    <View>
      <FlatList
        data={divSection}
        renderItem={item => (
          <View>
            <RenderHTML contentWidth={width} source={item.item} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({});

export default SectionComp;
