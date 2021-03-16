import * as React from 'react';
import { RefreshControl, FlatList, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Text, View } from '../components/Themed';

interface historyInfo {
  User: string;
  Action: string;
  Content: string;
}

const ListItem = ({ User, Action, Content }: historyInfo) => {
  return (
    <Card>
      <Card.Content>
        <Title>{`${User}@${Action}`}</Title>
        <Paragraph>{Content}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default function HistoryScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const [history, setHistory] = React.useState<historyInfo[]>([
    {
      User: 'aaa',
      Action: 'Pop',
      Content: 'A card',
    },
    {
      User: 'bbb',
      Action: 'Pop',
      Content: 'Guard',
    },
    {
      User: 'ccc',
      Action: 'Point',
      Content: 'aaa',
    },
  ]);

  const init = async () => {
    console.log('refreshing.....');
  };

  React.useEffect(() => {
    init();
  }, []);

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
