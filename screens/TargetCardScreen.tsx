import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Appbar, Button, Card, Title, Paragraph } from 'react-native-paper';
import Carousel from 'react-native-snap-carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';

const guard: any = require('../assets/images/usa/guard.png');
const countess: any = require('../assets/images/usa/countess.png');
const handmaid: any = require('../assets/images/usa/handmaid.png');
const king: any = require('../assets/images/usa/king.png');
const priest: any = require('../assets/images/usa/priest.png');
const prince: any = require('../assets/images/usa/prince.png');
const priness: any = require('../assets/images/usa/priness.png');
const baron: any = require('../assets/images/usa/baron.png');

export default function TargetCardScreen() {
  interface cardtype {
    title: string;
    content: string;
    source: any;
  }
  const [card, setCard] = React.useState<cardtype>({
    title: '',
    content: '',
    source: guard,
  });

  const navigation = useNavigation();
  const route = useRoute();

  const initialize = () => {
    let param: any = route?.params;
    setCard({
      title: param.title,
      content: param.content,
      source: param.source,
    });
  };

  React.useEffect(() => {
    initialize();
  }, []);

  const _goBack = () => console.log('Went back');

  const _handleSearch = () => console.log('Searching');

  const _handleMore = () => console.log('Shown more');

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Title" subtitle="Subtitle" />
        <Appbar.Action icon="magnify" onPress={_handleSearch} />
        <Appbar.Action icon="dots-vertical" onPress={_handleMore} />
      </Appbar.Header>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Card.Cover
            source={card.source}
            style={{ width: 350, height: 450, padding: 5 }}
            resizeMode={'contain'}
          />
          <Card.Content>
            <Title>{card.title}</Title>
            <Paragraph>{card.content}</Paragraph>
          </Card.Content>
          {/* <Card.Cover source={card.source} style={{ width: '100%', height: 400 }} /> */}
        </Card>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  cover: { padding: 5 },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
