import * as React from 'react';
import { StyleSheet, FlatList } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Avatar, Button, Card, Title, Paragraph, List } from 'react-native-paper';

import DisplayCard from '../components/DisplayCard';

export default function RuleScreen() {
  return (
    <View>
      <FlatList
        data={[{ key: 'cards' }, { key: 'rules' }]}
        renderItem={({ item }) => <DisplayCard type={item.key} />}
      />
    </View>
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
    marginVertical: 0,
    height: 1,
    width: '80%',
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
});
