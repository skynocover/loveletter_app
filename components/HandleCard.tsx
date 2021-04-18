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

export default function HandleCard({ title, content, source }: cardtype) {
  const navigation = useNavigation<StackNavigationProp<any>>();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.push('TargetCardScreen', { title, content, source });
      }}
      style={{
        display: 'flex',
        // width: Layout.window.width,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image
        source={source}
        style={{ width: Layout.window.width * 0.8, height: Layout.window.height * 0.8 }}
        resizeMode="contain"
      />
    </TouchableWithoutFeedback>
  );
}
