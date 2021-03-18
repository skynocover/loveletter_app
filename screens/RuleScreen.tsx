import * as React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Appbar, Avatar, Button, Card, Title, Paragraph, List } from 'react-native-paper';
import { Carousel } from '../_components/Carousel';
import Layout from '../constants/Layout';

const cards: any = require('../assets/images/usa/cards.png');
const rules: any = require('../assets/images/usa/rules.png');

export default function RuleScreen() {
  const data: string[] = ['cards', 'rules'];

  const _renderItem = ({ item, index }: any) => {
    return (
      <Image
        source={getCardContent(item).source}
        style={{ width: Layout.window.width * 0.8, height: Layout.window.height * 0.8 }}
        resizeMode="contain"
      />
    );
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C', margin: 0 }}>
        {/* <Appbar.BackAction onPress={_goBack} /> */}
        <Appbar.Content title="Rules" />
        {/* <Appbar.Action icon="magnify" onPress={_handleSearch} /> */}
      </Appbar.Header>
      <Carousel
        data={data}
        renderItem={_renderItem}
        sliderWidth={380}
        itemWidth={300}
        layout={'default'}
      />
    </>
  );
}

interface cardtype {
  title: string;
  source: any;
}

const getCardContent = (card: string): cardtype => {
  switch (card) {
    case 'cards':
      return {
        title: '所有卡片',
        source: cards,
      };
    case 'rules':
      return {
        title: '規則說明',
        source: rules,
      };

    default:
      return {
        title: '',
        source: rules,
      };
  }
};
