import * as React from 'react';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Appbar, Avatar, Button, Card, Title, Paragraph, TextInput } from 'react-native-paper';
import { Carousel } from '../_components/Carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { socketIO, AppContext } from '../appcontext';
import { Icon } from '../components/Icon';

import { useFocusEffect } from '@react-navigation/native';

export default function LoginScreen() {
  const appCtx = React.useContext(AppContext);

  const navigation = useNavigation<StackNavigationProp<any>>();

  const regist = async () => {
    if (appCtx.name === '') {
      Alert.alert('請輸入使用者名稱');
      return;
    }
    let data = await appCtx.fetch('post', '/api/players', {
      player: { id: socketIO.id, name: appCtx.name },
    });
    if (data) {
      appCtx.setLogin(true);
    }
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C' }}>
        <Appbar.Content title="Login" />
      </Appbar.Header>
      <TextInput
        label="Name"
        value={appCtx.name}
        onChangeText={(text) => {
          appCtx.setName(text);
        }}
      />
      <Button icon="login" mode="contained" onPress={regist}>
        註冊使用者
      </Button>
    </>
  );
}
