import * as React from 'react';
import { View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Appbar,
  Text,
  Modal,
  Portal,
  Avatar,
  Button,
  Provider,
  Card,
  Title,
  Divider,
  DefaultTheme,
  Paragraph,
  RadioButton,
} from 'react-native-paper';
// import { Carousel } from '../_components/Carousel'; // Version can be specified in package.json
import Carousel from 'react-native-snap-carousel';
import HandleCard from '../components/HandleCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { socketIO, AppContext } from '../appcontext';
import Layout from '../constants/Layout';
import { Socket } from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';

export default function HandleCardScreen() {
  const appCtx = React.useContext(AppContext);

  const [targetIndex, setTargetIndex] = React.useState(0);

  const [subTitle, setSubTitle] = React.useState<string>('');

  const _renderItem = ({ item, index }: any) => {
    return <HandleCard {...getCardContent(item)} />;
  };

  const _webRenderItem = (data: string[]) => {
    return data.map((item) => {
      return (
        <div>
          <HandleCard {...getCardContent(item)} />
        </div>
      );
    });
  };

  const init = async () => {
    let data = await appCtx.fetch('post', '/api/game/getCard', {
      id: socketIO.id,
      roomID: appCtx.roomID,
    });
    if (data) {
      appCtx.setHandCard((prevState: string[]) => {
        let newhandCard = [...data.handCard];
        console.log('after get card', newhandCard);
        return [...data.handCard];
      });
      // console.log('!!!!!!!!!!!!!  init 222222 !!!!!!!!!!!!!!!!!', data.handCard);
      // appCtx.GameService.send('Card', { handCard: data.handCard });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      init();
    }, []),
  );

  React.useEffect(() => {
    init();
  }, [appCtx.modelVisiable]);

  const playCard = async () => {
    let card = getCardContent(appCtx.handCard[targetIndex]);
    card.callback();
  };

  const getCardContent = (card: string): cardtype => {
    switch (card) {
      case 'guard':
        return {
          title: '衛兵',
          content: '猜一名對手手牌',
          source: guard,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'handmaid':
        return {
          title: '侍女',
          content: '一輪內不受其他牌影響',
          source: handmaid,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'countess':
        return {
          title: '伯爵夫人',
          content: '手上有國王或王子時必須棄掉',
          source: countess,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'baron':
        return {
          title: '男爵',
          content: '和一名對手比手牌,小者出局',
          source: baron,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'king':
        return {
          title: '國王',
          content: '和對手交換手牌',
          source: king,
          callback: () => {
            for (const card of appCtx.handCard) {
              if (card === 'countess') {
                Alert.alert('手上有國王或王子時必須打出伯爵夫人');
                return;
              }
            }
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'priest':
        return {
          title: '神父',
          content: '看一名對手手牌',
          source: priest,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'prince':
        return {
          title: '王子',
          content: '一名玩家棄掉手牌重抽',
          source: prince,
          callback: () => {
            for (const card of appCtx.handCard) {
              if (card === 'countess') {
                Alert.alert('手上有國王或王子時必須打出伯爵夫人');
                return;
              }
            }
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };
      case 'priness':
        return {
          title: '公主',
          content: '棄掉公主時出局',
          source: priness,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select index={targetIndex} />);
          },
        };

      default:
        return {
          title: '',
          content: '',
          source: guard,
          callback: () => {},
        };
    }
  };

  const onSnap = (index: number) => {
    setTargetIndex(index);
  };

  return (
    <>
      <Appbar.Header style={{ backgroundColor: '#CD5C5C' }}>
        <Appbar.Content title="HandCard" subtitle={subTitle} />
        <Appbar.Action icon="arrow-up-circle" onPress={playCard} />
      </Appbar.Header>
      <View style={styles.container}>
        <Carousel
          onSnapToItem={onSnap}
          data={appCtx.handCard}
          renderItem={_renderItem}
          sliderWidth={Layout.window.width}
          itemWidth={Layout.window.width * 0.8}
          layout={'default'}
          extraData={appCtx.handCard}
          // webRenderItem={_webRenderItem}
        />
      </View>
      <Provider>
        <Portal>
          <Modal
            visible={appCtx.modelVisiable}
            onDismiss={() => appCtx.setModalVisible(false)}
            contentContainerStyle={{
              backgroundColor: 'black',
              margin: Layout.window.width * 0.1,
            }}
          >
            {appCtx.modelContent}
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
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
  callback: any;
}

const guard: any = require('../assets/images/usa/guard.png');
const countess: any = require('../assets/images/usa/countess.png');
const handmaid: any = require('../assets/images/usa/handmaid.png');
const king: any = require('../assets/images/usa/king.png');
const priest: any = require('../assets/images/usa/priest.png');
const prince: any = require('../assets/images/usa/prince.png');
const priness: any = require('../assets/images/usa/priness.png');
const baron: any = require('../assets/images/usa/baron.png');

const Select = ({ index }: { index: number }) => {
  const appCtx = React.useContext(AppContext);

  const [selectOpponent, setSelectOpponent] = React.useState('');
  const [selectCard, setSelectCard] = React.useState('');
  const [handCardType, setHandCardType] = React.useState('');
  const [roommate, setRoommate] = React.useState<string[]>([]);

  React.useEffect(() => {
    setHandCardType(appCtx.handCard[index]);
    getRoommate();
  }, []);

  const getRoommate = async () => {
    let data = await appCtx.fetch('get', `/api/players/${appCtx.roomID}`);
    if (data) {
      if (data.players !== undefined) {
        let mate: any;
        if (appCtx.handCard[index] === 'prince') {
          mate = data.players.filter((item: any) => !item.shield);
        } else {
          mate = data.players.filter((item: any) => item.name !== appCtx.name && !item.shield);
        }

        let mate2: string[] = [];
        mate.map((item: any) => {
          mate2.push(item.name);
        });
        console.log(`mate2: ${mate2}`);
        setRoommate(mate2);
      }
    }
  };

  const check = async () => {
    appCtx.setModalVisible(false);

    let data = await appCtx.fetch('post', '/api/game/playCard', {
      id: socketIO.id,
      roomID: appCtx.roomID,
      card: index,
      content: {
        opponent: selectOpponent,
        card: selectCard,
      },
    });

    if (data) {
      console.log(`success resp play card, index: ${index}`);
      appCtx.setHandCard([]);
      // appCtx.setHandCard((preState) => preState.splice(index - 1, 1));
    }
  };

  const memoizedValue = React.useMemo(() => {
    switch (handCardType) {
      case 'handmaid':
        return '至下一輪前不受其他對手卡牌影響';
      case 'countess':
        return '手上有國王或王子時必須棄掉';
      default:
        return '棄掉公主時出局';
    }
  }, [handCardType]);

  const cardType = [
    { label: '神父', value: 'priest' },
    { label: '男爵', value: 'baron' },
    { label: '侍女', value: 'handmaid' },
    { label: '王子', value: 'prince' },
    { label: '國王', value: 'king' },
    { label: '伯爵夫人', value: 'countess' },
    { label: '公主', value: 'priness' },
  ];

  return (
    <>
      {handCardType === 'handmaid' || handCardType === 'countess' || handCardType === 'priness' ? (
        <Text style={{ color: 'white', padding: 15 }}>{memoizedValue}</Text>
      ) : (
        <>
          <Text style={{ color: 'white', padding: 5 }}>請選擇一名對手</Text>
          <RadioButton.Group
            onValueChange={(value) => setSelectOpponent(value)}
            value={selectOpponent}
          >
            {roommate.map((item) => (
              <RadioButton.Item key={item} label={item} value={item} />
            ))}
          </RadioButton.Group>
          {handCardType === 'guard' && (
            <>
              <Divider style={{ backgroundColor: 'white', marginVertical: 5 }} />
              <Text style={{ color: 'white' }}>請選擇一種手牌</Text>
              <RadioButton.Group onValueChange={(value) => setSelectCard(value)} value={selectCard}>
                {cardType.map((item) => (
                  <RadioButton.Item key={item.label} label={item.label} value={item.value} />
                ))}
              </RadioButton.Group>
            </>
          )}
        </>
      )}

      <Button icon="check" mode="contained" onPress={check}>
        確認
      </Button>
    </>
  );
};
