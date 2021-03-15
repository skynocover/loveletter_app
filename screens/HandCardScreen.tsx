import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';
import { StackNavigationProp } from '@react-navigation/stack';

export default function HandleCardScreen() {
  const cards: string[] = ['guard', 'countess'];
  let _carousel = React.createRef<any>();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const _renderItem = ({ item, index }: any) => {
    return <HandleCard type={item} />;
  };

  const _handleSearch = () =>
    navigation.push('TargetCardScreen', getCardContent(cards[_carousel.current.currentIndex]));

  const _handleMore = () => console.log('Shown more');
  return (
    <>
      <Appbar.Header>
        {/* <Appbar.BackAction onPress={_goBack} /> */}
        <Appbar.Content title="Title" subtitle="Subtitle" />
        <Appbar.Action icon="magnify" onPress={_handleSearch} />
        <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
      </Appbar.Header>
      <View style={styles.container}>
        <Carousel
          ref={_carousel}
          data={cards}
          renderItem={_renderItem}
          sliderWidth={800}
          itemWidth={300}
          layout={'default'}
        />
      </View>
    </>
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

interface cardtype {
  title: string;
  content: string;
  source: any;
}

const guard: any = require('../assets/images/usa/guard.png');
const countess: any = require('../assets/images/usa/countess.png');
const handmaid: any = require('../assets/images/usa/handmaid.png');
const king: any = require('../assets/images/usa/king.png');
const priest: any = require('../assets/images/usa/priest.png');
const prince: any = require('../assets/images/usa/prince.png');
const priness: any = require('../assets/images/usa/priness.png');
const baron: any = require('../assets/images/usa/baron.png');

const getCardContent = (card: string): cardtype => {
  switch (card) {
    case 'guard':
      return {
        title: '衛兵',
        content: '猜一名對手手牌',
        source: guard,
      };
    case 'handmaid':
      return {
        title: '侍女',
        content: '一輪內不受其他牌影響',
        source: handmaid,
      };
    case 'countess':
      return {
        title: '伯爵夫人',
        content: '手上有國王或王子時必須棄掉',
        source: countess,
      };
    case 'baron':
      return {
        title: '男爵',
        content: '和一名對手比手牌,小者出局',
        source: baron,
      };
    case 'king':
      return {
        title: '國王',
        content: '和對手交換手牌',
        source: king,
      };
    case 'priest':
      return {
        title: '神父',
        content: '看一名對手手牌',
        source: priest,
      };
    case 'prince':
      return {
        title: '王子',
        content: '一名玩家棄掉手牌重抽',
        source: prince,
      };
    case 'priness':
      return {
        title: '公主',
        content: '棄掉公主時出局',
        source: priness,
      };

    default:
      return {
        title: '',
        content: '',
        source: guard,
      };
  }
};
