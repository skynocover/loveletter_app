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

interface playerInfo {
  id: string;
  name: string;
  ready: boolean;
}

const ListItem = ({ id, name, ready }: playerInfo) => {
  return (
    <Card>
      <Card.Title
        title={name}
        subtitle={id}
        left={(props) => (
          <Icon name={ready ? 'AntDesign/checkcircle' : 'Ionicons/md-radio-button-off'} size={25} />
        )}
      />
      <Card.Content>{/* <Paragraph>{ready ? '已準備' : '未準備'}</Paragraph> */}</Card.Content>
    </Card>
  );
};

export default function BoardScreen() {
  const appCtx = React.useContext(AppContext);

  const [players, setPlayers] = React.useState<playerInfo[]>([]);

  const [check, setCheck] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  const [targetIndex, setTargetIndex] = React.useState(0);

  const [subTitle, setSubTitle] = React.useState<string>('');

  const getPlayers = async () => {
    let data = await appCtx.fetch(
      'get',
      `/api/players/${appCtx.roomID === '' ? 'none' : appCtx.roomID}`,
    );
    if (data) {
      console.log(data.players);
      setPlayers(data.players);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // if (socketIO.disconnected) {
      //   socketIO.
      // }
      console.log('on focus');
      getPlayers();
    }, []),
  );

  React.useEffect(() => {
    __DEV__ && socketIO.off('player');
    socketIO.on('player', (action: string, player: any) => {
      if (action === 'add') {
        setPlayers((prePlayer: playerInfo[]) => {
          prePlayer.push(player);
          return [...prePlayer];
        });
      } else if (action === 'del') {
        setPlayers((prePlayer: playerInfo[]) => {
          let newArr = prePlayer.filter((item) => item.id !== player);
          return [...newArr];
        });
      } else if (action === 'ready') {
        setPlayers((prePlayer: playerInfo[]) => {
          let newArr = prePlayer.map((item) => {
            if (item.name === player) {
              item.ready = true;
            }
            return item;
          });
          return [...newArr];
        });
      } else if (action === 'unReady') {
        setPlayers((prePlayer: playerInfo[]) => {
          let newArr = prePlayer.map((item) => {
            if (item.name === player) {
              item.ready = false;
            }
            return item;
          });
          return [...newArr];
        });
      }
    });
    getPlayers();
    return () => {
      socketIO.off('newPlayer');
    };
  }, []);

  const regist = async () => {
    if (appCtx.name === '') {
      Alert.alert('請輸入使用者名稱');
      return;
    }
    let data = await appCtx.fetch('post', '/api/players', {
      player: { id: socketIO.id, name: appCtx.name },
    });
    if (data) {
      setCheck(true);
    }
  };

  const readybtm = async () => {
    let data: Promise<any>;
    if (!ready) {
      data = await appCtx.fetch('post', `/api/players/ready/${appCtx.name}`);
    } else {
      data = await appCtx.fetch('delete', `/api/players/ready/${appCtx.name}`);
    }

    console.log(data);
    if (data) {
      setReady(!ready);
    }
  };

  const startGame = async () => {
    let data: any;
    if (appCtx.gameState === 'beforeStart') {
      data = await appCtx.fetch('post', '/api/game/start');
    } else {
      data = await appCtx.fetch('post', '/api/game/restart', {
        roomID: appCtx.roomID,
      });
    }

    // if (data) {
    //   Alert.alert(appCtx.gameState === 'beforeStart' ? '遊戲開始' : '遊戲重新開始');
    // }
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
        <Appbar.Content
          title="Board"
          subtitle={appCtx.GameService.state.value === 'beforeStart' ? '遊戲大廳' : '房間'}
        />
      </Appbar.Header>
      <TextInput
        label="Name"
        disabled={check}
        value={appCtx.name}
        onChangeText={(text) => {
          appCtx.setName(text);
        }}
      />
      {!check ? (
        <Button icon="login" mode="contained" onPress={regist}>
          註冊使用者
        </Button>
      ) : (
        appCtx.gameState === 'beforeStart' && (
          <Button
            icon={ready ? 'checkbox-marked' : 'checkbox-blank-off'}
            mode="contained"
            onPress={readybtm}
          >
            {ready ? '已準備' : '準備中'}
          </Button>
        )
      )}

      <FlatList
        contentContainerStyle={{ paddingVertical: 20 }}
        keyExtractor={(item, index) => index.toString()}
        data={players}
        renderItem={({ item }) => <ListItem {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <Button
        icon={'arrow-right-bold-circle'}
        mode="contained"
        disabled={!check}
        onPress={startGame}
      >
        {appCtx.gameState === 'beforeStart' ? '開始遊戲' : '重新開始'}
      </Button>
    </>
  );
}
