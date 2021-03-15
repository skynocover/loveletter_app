import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import EditScreenInfo from './EditScreenInfo';
import { Text, View } from './Themed';
import path from 'path';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

// import image from '../assets/images/usa';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="cards" />;

const guard: any = require('../assets/images/usa/guard.png');
const countess: any = require('../assets/images/usa/countess.png');
const handmaid: any = require('../assets/images/usa/handmaid.png');
const king: any = require('../assets/images/usa/king.png');
const priest: any = require('../assets/images/usa/priest.png');
const prince: any = require('../assets/images/usa/prince.png');
const priness: any = require('../assets/images/usa/priness.png');
const baron: any = require('../assets/images/usa/baron.png');

const cards: any = require('../assets/images/usa/cards.png');
const rules: any = require('../assets/images/usa/rules.png');

/////////////////////////

interface cardProp {
  type: string;
}

export default function HandleCard(props: cardProp) {
  const [card, setCard] = React.useState<cardtype>({
    title: '',
    content: '',
    source: guard,
  });

  const navigation = useNavigation<StackNavigationProp<any>>();

  const initialize = () => {
    setCard(getCardContent(props.type));
    console.log(card);
  };

  React.useEffect(() => {
    initialize();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={() => {}}>
      <Image
        source={card.source}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback>

    // <Card style={{ flex: 1 }}>
    //   <Card.Title title="Hand Card" subtitle="選擇一張並打出" left={LeftContent} />

    //   <Card.Cover source={card.source} style={{ height: 350 }} resizeMode="contain" />

    //   {/* <Image source={card.source} style={{ width: '100%', height: '100%' }} resizeMode="contain" /> */}

    //   <Card.Content>
    //     <Title>{card.title}</Title>
    //     <Paragraph>{card.content}</Paragraph>
    //   </Card.Content>
    //   <Card.Actions>
    //     <Button>打出</Button>
    //     {/* <Button>Ok</Button> */}
    //   </Card.Actions>
    // </Card>
  );
}

interface cardtype {
  title: string;
  content: string;
  source: any;
}

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
