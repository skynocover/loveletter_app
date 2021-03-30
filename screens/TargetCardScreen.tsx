import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Text, View } from '../components/Themed';
import { Appbar, Button, Card, Title, Paragraph } from 'react-native-paper';

export default function TargetCardScreen() {
  interface cardtype {
    title: string;
    content: string;
    source: any;
  }
  const [card, setCard] = React.useState<cardtype>({
    title: '',
    content: '',
    source: null,
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

  const _goBack = () => navigation.goBack();

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={_goBack} style={{ backgroundColor: 'dark' }} />
        <Appbar.Content title={card.title} />
      </Appbar.Header>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Card style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
          <Card.Cover
            source={card.source}
            style={{ width: 350, height: 450, padding: 5 }}
            resizeMode={'contain'}
          />
          <Card.Content>
            <Paragraph>{card.content}</Paragraph>
          </Card.Content>
        </Card>
      </View>
    </>
  );
}
