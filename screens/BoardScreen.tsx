import * as React from 'react';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  TextInput,
  Headline,
} from 'react-native-paper';
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

  const [ready, setReady] = React.useState(false);
  const [reFresh, setReFresh] = React.useState(false);

  const getPlayers = async () => {
    console.log(appCtx.roomID);
    let data = await appCtx.fetch('get', `/api/players/${appCtx.roomID}`);
    if (data) {
      console.log(data);
      if (data.players !== undefined) {
        setPlayers(data.players);

        for (const p of data.players) {
          if (p.name === appCtx.name) {
            setReady(p.ready);
          }
        }
      } else {
        let data = await appCtx.fetch('get', `/api/players/none`);
        if (data) {
          setPlayers(data.players);

          for (const p of data.players) {
            if (p.name === appCtx.name) {
              setReady(p.ready);
            }
          }
        }
      }
    } else {
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setReFresh(!reFresh);
    }, []),
  );

  React.useEffect(() => {
    getPlayers();
  }, [reFresh]);

  React.useEffect(() => {
    if (appCtx.gameState === 'beforeStart') {
      setPlayers((prePlayers: playerInfo[]) => {
        prePlayers.map((item) => {
          item.ready = false;
        });
        return [...prePlayers];
      });
      setReady(false);
    }
  }, [appCtx.gameState]);

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
      getPlayers();
    }
  };

  const styles = StyleSheet.create({
    header: { backgroundColor: '#CD5C5C' },
    playerView: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      marginVertical: 10,
      marginBottom: 10,
    },
    playerName: { fontWeight: 'bold', fontSize: 20, flex: 3 },
  });

  return (
    <>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title="Board"
          subtitle={appCtx.gameState === 'beforeStart' ? '遊戲大廳' : `房間 ${appCtx.roomID}`}
        />
      </Appbar.Header>
      <View style={styles.playerView}>
        <Text style={styles.playerName}>玩家名稱: {appCtx.name}</Text>
        {appCtx.gameState === 'beforeStart' && (
          <Button
            icon={ready ? 'checkbox-marked' : 'checkbox-blank-off'}
            mode="contained"
            onPress={readybtm}
            style={{ flex: 1 }}
          >
            {ready ? '已準備' : '準備中'}
          </Button>
        )}
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 10 }}
        keyExtractor={(item, index) => index.toString()}
        data={players}
        renderItem={({ item }) => <ListItem {...item} />}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

      <Button icon={'arrow-right-bold-circle'} mode="contained" onPress={startGame}>
        {appCtx.gameState === 'beforeStart' ? '開始遊戲' : '重新開始'}
      </Button>
    </>
  );
}
