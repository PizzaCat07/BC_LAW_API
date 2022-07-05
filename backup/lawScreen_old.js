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
import RenderHTML, {CustomBlockRenderer} from 'react-native-render-html';
import {
  IndexPath,
  Layout,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';

import {getLaw} from '../redux/bcLaw';
import SectionComp from '../components/Section';
import {index} from 'cheerio/lib/api/traversing';

const LawScreen = props => {
  console.log('id from parent', props.route.params.id);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const content = useSelector(state => state.law.content);
  const title = useSelector(state => state.law.title);
  const part = useSelector(state => state.law.part);
  const section = useSelector(state => state.law.section);

  props.navigation.setOptions({title}, [title]);

  //group data by divTitle for sectionList
  /* const data = Object.values(
    section.reduce((group, el) => {
      group[el.divTitle] = group[el.divTitle] || {
        title: el.divTitle,
        data: [],
      };
      group[el.divTitle].data.push({
        id: el.id,
        divId: el.divId,
        divTitle: el.divTitle,
        html: el.html,
      });
      return group;
    }, {}),
  ); */

  //console.log(data);

  const {width} = useWindowDimensions();
  const ref = useRef();
  const sectionRef = useRef();

  const [dropDownIndex, setDropDownIndex] = useState(0);

  useEffect(() => {
    dispatch(getLaw(props.route.params.id));
    console.log('dispatch');
  }, [dispatch]);

  const scrollToIndex = dropDownIndex => {
    console.log(dropDownIndex);
    ref.current.scrollToIndex({animated: true, index: dropDownIndex});
  };

  const scrollToSection = () => {
    sectionRef.current.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 8,
    });
  };

  const renderRowNum = section.length;

  const onPress = () => console.log('working');

  const DivRenderer: CustomBlockRenderer = function DivRenderer({
    TDefaultRenderer,
    ...props
  }) {
    return <TDefaultRenderer {...props} onPress={onPress} />;
  };

  const renderers = {div: DivRenderer};

  if (!loading) {
    return (
      <View>
        <Text>Loading</Text>
      </View>
    );
  }
  return (
    <View>
      <View style={styles.header}>
        {/* <RenderHTML contentWidth={width} source={title} /> */}
        {/*  <Text style={styles.title}>{title}</Text> */}
        <Text style={styles.part}>{part}</Text>
        <Select
          selectedIndex={dropDownIndex}
          onSelect={index => scrollToIndex(index.row)}
          placeholder="Select Section">
          {content.map((item, index) => {
            return <SelectItem title={item.title} />;
          })}
        </Select>
      </View>
      <View style={styles.container}>
        <FlatList
          ref={ref}
          initialNumToRender={renderRowNum}
          data={section}
          initialScrollIndex={dropDownIndex}
          keyExtractor={(item, index) => item.key}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 1000));
            wait.then(() => {
              ref.current?.scrollToIndex({index: info.index, animated: true});
            });
          }}
          renderItem={(item, index) => (
            <View>
              <Text>{item.item.id}</Text>
              <Text>{item.index}</Text>
              <RenderHTML contentWidth={width} source={item.item} />
            </View>
          )}
        />
      </View>
      <View>
        {/*  <SectionList
          ref={sectionRef}
          sections={data}
          keyExtractor={(item, index) => item + index}
          initialScrollIndex={dropDownIndex}
          renderItem={({item}) => (
            <View>
              <RenderHTML contentWidth={width} source={item} />
            </View>
          )}
          renderSectionHeader={({section: {title}}) => (
            <Text style={styles.header}>{title}</Text>
          )}
        /> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  container: {
    height: '90%',
    alignContent: 'flex-start',
    justifyContent: 'flex-start',
  },
});

export default LawScreen;
