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

import { useFocusEffect } from '@react-navigation/native';

interface playerInfo {
  id: string;
  name: string;
}

const ListItem = ({ id, name }: playerInfo) => {
  return (
    <Card>
      <Card.Content>
        <Title>{id}</Title>
        <Paragraph>{name}</Paragraph>
      </Card.Content>
    </Card>
  );
};

export default function BoardScreen() {
  const appCtx = React.useContext(AppContext);

  const [players, setPlayers] = React.useState([]);
  const [name, setName] = React.useState('');

  const [check, setCheck] = React.useState(false);

  const [targetIndex, setTargetIndex] = React.useState(0);

  const [subTitle, setSubTitle] = React.useState<string>('');

  const getPlayers = async () => {
    let data = await appCtx.fetch('get', '/api/players');
    setPlayers(data.players);
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('on focus');
      getPlayers();
    }, []),
  );

  React.useEffect(() => {
    __DEV__ && socketIO.off('newPlayer');
    socketIO.on('newPlayer', (data: any) => {
      console.log('newplayer:', data);
    });
    getPlayers();
    return () => {
      socketIO.off('newPlayer');
    };
  }, []);

  const regist = async () => {
    if (name === '') {
      Alert.alert('請輸入使用者名稱');
      return;
    }
    let data = await appCtx.fetch('post', '/api/players', {
      player: { id: socketIO.id, name: name },
    });
    if (data) {
      setCheck(true);
    }
  };

  const _handleMore = () => {
    console.log(`Target indtx: ${targetIndex}`);
    socketIO.emit('msg', { aaa: 'bbb' });
    // console.log(_carousel.current.currentIndex);
    // setHandCard(handCard.splice(_carousel.current.currentIndex - 1, 1));
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C' }}>
        <Appbar.Content title="HandCard" subtitle={subTitle} />
      </Appbar.Header>
      <TextInput
        label="Name"
        disabled={check}
        value={name}
        onChangeText={(text) => {
          setName(text);
        }}
      />
      <Button icon="login" mode="contained" disabled={check} onPress={regist}>
        註冊使用者
      </Button>
      <FlatList
        contentContainerStyle={{ paddingVertical: 20 }}
        keyExtractor={(item, index) => index.toString()}
        data={players}
        renderItem={({ item }) => <ListItem {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
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
  card: {
    flexDirection: 'row',
  },
});

interface cardtype {
  title: string;
  content: string;
  source: any;
}

const guard: any = require('../assets/images/usa/guard.png');
const countess: any = require('../assets/images/usa/countess.png');
const handmaid: any = require('../assets/images/usa/handmaid.png');
const king: any = require('../assets/images/usa/king.png');
const priest: any = require('../assets/images/usa/priest.png');
const prince: any = require('../assets/images/usa/prince.png');
const priness: any = require('../assets/images/usa/priness.png');
const baron: any = require('../assets/images/usa/baron.png');

const getCardContent = (card: string): cardtype => {
  switch (card) {
    case 'guard':
      return {
        title: '衛兵',
        content: '猜一名對手手牌',
        source: guard,
      };
    case 'handmaid':
      return {
        title: '侍女',
        content: '一輪內不受其他牌影響',
        source: handmaid,
      };
    case 'countess':
      return {
        title: '伯爵夫人',
        content: '手上有國王或王子時必須棄掉',
        source: countess,
      };
    case 'baron':
      return {
        title: '男爵',
        content: '和一名對手比手牌,小者出局',
        source: baron,
      };
    case 'king':
      return {
        title: '國王',
        content: '和對手交換手牌',
        source: king,
      };
    case 'priest':
      return {
        title: '神父',
        content: '看一名對手手牌',
        source: priest,
      };
    case 'prince':
      return {
        title: '王子',
        content: '一名玩家棄掉手牌重抽',
        source: prince,
      };
    case 'priness':
      return {
        title: '公主',
        content: '棄掉公主時出局',
        source: priness,
      };

    default:
      return {
        title: '',
        content: '',
        source: guard,
      };
  }
};
