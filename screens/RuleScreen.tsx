import * as React from 'react';
import { StyleSheet, FlatList, Image } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Appbar, Avatar, Button, Card, Title, Paragraph, List } from 'react-native-paper';
// import { Carousel } from '../_components/Carousel';
import Carousel from 'react-native-snap-carousel';
import Layout from '../constants/Layout';

const cards: any = require('../assets/images/usa/cards.png');
const rules: any = require('../assets/images/usa/rules.png');

export default function RuleScreen() {
  const data: string[] = ['cards', 'rules'];

  const _renderItem = ({ item, index }: any) => {
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={getCardContent(item).source}
          style={{ width: Layout.window.width * 0.8, height: Layout.window.height * 0.8 }}
          resizeMode="contain"
        />
      </View>
    );
  };

  const _webRenderItem = (data: string[]) => {
    return (
      <div
        style={{
          display: 'flex',
          width: Layout.window.width,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {data.map((item) => {
          return (
            <div>
              <Image
                source={getCardContent(item).source}
                style={{ width: Layout.window.width * 0.8, height: Layout.window.height * 0.8 }}
                resizeMode="contain"
              />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C', margin: 0 }}>
        <Appbar.Content title="Rules" />
      </Appbar.Header>
      <Carousel
        data={data}
        renderItem={_renderItem}
        sliderWidth={Layout.window.width}
        itemWidth={Layout.window.width * 0.8}
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
