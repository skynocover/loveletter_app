import * as React from 'react';
import { StyleSheet, Image } from 'react-native';

import EditScreenInfo from './EditScreenInfo';
import { Text, View } from './Themed';
import path from 'path';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';

// import image from '../assets/images/usa';

const LeftContent = (props: any) => <Avatar.Icon {...props} icon="folder" />;

const cards: any = require('../assets/images/usa/cards.png');
const rules: any = require('../assets/images/usa/rules.png');

/////////////////////////

interface cardProp {
  type: string;
}

export default function DisplayCard(props: cardProp) {
  const [card, setCard] = React.useState<cardtype>({
    title: '',
    source: cards,
  });

  const initialize = () => {
    setCard(getCardContent(props.type));
  };

  React.useEffect(() => {
    initialize();
  }, []);

  return (
    <Card>
      <Card.Content>
        <Title>{card.title}</Title>
      </Card.Content>
      <Card.Cover source={card.source} />
    </Card>
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
