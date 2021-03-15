import * as React from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';

export default function HandleCardScreen() {
  const cards: string[] = ['guard', 'countess'];

  const _renderItem = ({ item, index }: any) => {
    return <HandleCard type={item} />;
  };

  return (
    <View style={styles.container}>
      <Carousel
        data={cards}
        renderItem={_renderItem}
        sliderWidth={800}
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  card: {
    flexDirection: 'row',
  },
});
