import * as React from 'react';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Appbar, Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

import { Text, View } from '../components/Themed';

import { socketIO, AppContext } from '../appcontext';
import { Icon } from '../components/Icon';
import Layout from '../constants/Layout';

export default function LoginScreen() {
  const appCtx = React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const styles = StyleSheet.create({
    header: { backgroundColor: '#CD5C5C', height: Layout.window.height * 0.25 },
    input: {
      marginTop: Layout.window.height * 0.1,
      marginHorizontal: Layout.window.width * 0.1,
    },
    button: { marginHorizontal: Layout.window.width * 0.1 },
    title: { fontStyle: 'italic', fontWeight: 'bold', fontSize: 35 },
  });

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Love Letter" titleStyle={styles.title} />
      </Appbar.Header>
      <TextInput
        label="Name"
        value={appCtx.name}
        onChangeText={(text) => appCtx.setName(text)}
        style={styles.input}
      />
      <View style={{ marginVertical: 5 }} />
      <Button mode="contained" onPress={appCtx.regist} style={styles.button} color={'#CD5C5C'}>
        login
      </Button>
    </>
  );
}
