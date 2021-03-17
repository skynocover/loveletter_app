import * as React from 'react';
import { RefreshControl, FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Text, View } from '../components/Themed';
import { socketIO, AppContext } from '../appcontext';
import { useFocusEffect } from '@react-navigation/native';

interface historyInfo {
  title: string;
  content: string;
}

const ListItem = ({ title, content }: historyInfo) => {
  return (
    <Card>
      <Card.Content>
        <Title>{title}</Title>
        <Paragraph>{content}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default function HistoryScreen() {
  const appCtx = React.useContext(AppContext);
  const [refreshing, setRefreshing] = React.useState(false);

  const [history, setHistory] = React.useState<historyInfo[]>([]);

  const newHistory = (info: historyInfo) => {
    console.log(info);
    // history.unshift(info);

    setHistory((prevState: historyInfo[]) => {
      prevState.unshift(info);
      return [...prevState];
    });
  };

  const newnew = (data: any) => {
    newHistory(data);
  };

  const init = async () => {
    let data = await appCtx.fetch('get', '/api/history');
    if (data !== null) {
      setHistory(data.history.reverse());
    }
    socketIO.on('newHistory', newnew);
    return () => {
      socketIO.off('newHistory', newnew);
    };
  };

  React.useEffect(() => {
    init();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('on focus');
      init();
    }, []),
  );

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C' }}>
        {/* <Appbar.BackAction onPress={_goBack} /> */}
        <Appbar.Content title="History" />
        {/* <Appbar.Action icon="magnify" onPress={_handleSearch} /> */}
      </Appbar.Header>
      <FlatList
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await init();
              setRefreshing(false);
            }}
          />
        }
        keyExtractor={(item, index) => index.toString()}
        data={history}
        renderItem={({ item }) => <ListItem {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
      {/* <View style={styles.container}>
        <Text style={styles.title}>Tab Two</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
        <EditScreenInfo path="/screens/TabTwoScreen.tsx" />
      </View> */}
    </>
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
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
