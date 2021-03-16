import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import EditScreenInfo from './EditScreenInfo';
import { Text, View } from './Themed';
import path from 'path';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

//////////////////////////////////////////////////////

interface cardtype {
  title: string;
  content: string;
  source: any;
}

export default function HandleCard(props: cardtype) {
  const [card, setCard] = React.useState<cardtype>({
    title: '',
    content: '',
    source: null,
  });

  const navigation = useNavigation<StackNavigationProp<any>>();

  const initialize = () => {
    console.log('props ', props);
    setCard(props);
  };

  React.useEffect(() => {
    initialize();
  }, []);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('TargetCardScreen', card);
      }}
    >
      <Image
        source={card.source}
        style={{
          width: '100%',
          height: '100%',
        }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback>
  );
}
