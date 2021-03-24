import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from './Themed';
import { Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import Layout from '../constants/Layout';

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
    // console.log('props ', props);
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
      style={{
        display: 'flex',
        // width: Layout.window.width,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={card.source}
        style={{ width: Layout.window.width * 0.8, height: Layout.window.height * 0.8 }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback>
  );
}
