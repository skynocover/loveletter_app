import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Avatar, Button, Card, Title, Paragraph, List } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel';
import DisplayCard from '../components/DisplayCard';

export default function RuleScreen() {
  const data: any = ['cards', 'rules'];

  const _renderItem = ({ item, index }: any) => {
    return <DisplayCard type={item} />;
  };

  return (
    <View>
      <Carousel
        data={data}
        renderItem={_renderItem}
        sliderWidth={380}
        itemWidth={300}
        layout={'default'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 0,
    height: 1,
    width: '80%',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
