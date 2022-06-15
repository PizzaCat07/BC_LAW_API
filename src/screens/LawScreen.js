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
import {
  IndexPath,
  Layout,
  Select,
  SelectGroup,
  SelectItem,
} from '@ui-kitten/components';

import {getLaw} from '../redux/bcLaw';
import SectionComp from '../components/Section';

const LawScreen = props => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const content = useSelector(state => state.law.content);
  const title = useSelector(state => state.law.title);
  const part = useSelector(state => state.law.part);
  const section = useSelector(state => state.law.section);

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

  const dropDownIndex = 0;

  useEffect(() => {
    setLoading(false);
    dispatch(getLaw(props.route.params.id));
    setLoading(true);
  }, [dispatch]);

  const scrollToIndex = dropDownIndex => {
    ref.current.scrollToIndex({animated: true, index: dropDownIndex});
  };

  const scrollToSection = () => {
    sectionRef.current.scrollToLocation({
      animated: true,
      sectionIndex: 0,
      itemIndex: 8,
    });
  };

  //console.log(section);

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
        <Text>{title}</Text>
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
          data={section}
          initialScrollIndex={dropDownIndex}
          keyExtractor={item => item.id}
          onScrollToIndexFailed={info => {
            const wait = new Promise(resolve => setTimeout(resolve, 500));
            wait.then(() => {
              ref.current?.scrollToIndex({index: info.index, animated: true});
            });
          }}
          renderItem={item => (
            <View>
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
  },
  part: {
    fontSize: 12,
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
  container: {
    height: '80%',
  },
});

export default LawScreen;
