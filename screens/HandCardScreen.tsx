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
import { Carousel } from '../_components/Carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { socketIO, AppContext } from '../appcontext';
import Layout from '../constants/Layout';

export default function HandleCardScreen() {
  const appCtx = React.useContext(AppContext);

  const [targetIndex, setTargetIndex] = React.useState(0);

  const [subTitle, setSubTitle] = React.useState<string>('');

  const cards: string[] = ['guard', 'countess'];
  // let _carousel = React.useRef<Carousel<any>>();
  let _carousel = React.createRef<any>();

  const navigation = useNavigation<StackNavigationProp<any>>();

  const getHandCard = async () => {
    console.log('Query the card in hand');
  };

  React.useEffect(() => {
    socketIO.on('welcome', (data: any) => {
      console.log(data);
      Alert.alert('ok?', 'okk??');
    });
    getHandCard();
    return () => {
      socketIO.off('welcome');
    };
  }, []);

  const _renderItem = ({ item, index }: any) => {
    return <HandleCard {...getCardContent(item)} />;
  };

  const _webRenderItem = (data: string[]) => {
    console.log('webRenderItem');
    return data.map((item) => {
      return (
        <div>
          <HandleCard {...getCardContent(item)} />
        </div>
      );
    });
  };

  const _handleMore = async () => {
    console.log(`Target indtx: ${targetIndex}`);

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
            appCtx.setModelContent(<Select type="guard" />);
          },
        };
      case 'handmaid':
        return {
          title: '侍女',
          content: '一輪內不受其他牌影響',
          source: handmaid,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(
              <Text style={{ color: 'white' }}>
                Example Modal. Click outside this area to dismiss.
              </Text>,
            );
          },
        };
      case 'countess':
        return {
          title: '伯爵夫人',
          content: '手上有國王或王子時必須棄掉',
          source: countess,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(
              <Text style={{ color: 'white' }}>
                Example Modal. Click outside this area to dismiss.
              </Text>,
            );
          },
        };
      case 'baron':
        return {
          title: '男爵',
          content: '和一名對手比手牌,小者出局',
          source: baron,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select type="baron" />);
          },
        };
      case 'king':
        return {
          title: '國王',
          content: '和對手交換手牌',
          source: king,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select type="king" />);
          },
        };
      case 'priest':
        return {
          title: '神父',
          content: '看一名對手手牌',
          source: priest,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select type="priest" />);
          },
        };
      case 'prince':
        return {
          title: '王子',
          content: '一名玩家棄掉手牌重抽',
          source: prince,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(<Select type="prince" />);
          },
        };
      case 'priness':
        return {
          title: '公主',
          content: '棄掉公主時出局',
          source: priness,
          callback: () => {
            appCtx.setModalVisible(true);
            appCtx.setModelContent(
              <Text style={{ color: 'white' }}>
                Example Modal. Click outside this area to dismiss.
              </Text>,
            );
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
        {/* <Appbar.BackAction onPress={_goBack} /> */}
        <Appbar.Content title="HandCard" subtitle={subTitle} />
        {/* <Appbar.Action icon="magnify" onPress={_handleSearch} /> */}
        <Appbar.Action icon="arrow-up-circle" onPress={_handleMore} />
      </Appbar.Header>
      <View style={styles.container}>
        <Carousel
          onSnapToItem={onSnap}
          data={appCtx.handCard}
          renderItem={_renderItem}
          webRenderItem={_webRenderItem}
        />
      </View>
      <Provider>
        <Portal>
          <Modal
            visible={appCtx.modelVisiable}
            onDismiss={() => {
              appCtx.setModalVisible(false);
            }}
            contentContainerStyle={{
              backgroundColor: 'black',
              // height: Layout.window.height * 0.6,
              margin: Layout.window.width * 0.1,
            }}
          >
            {appCtx.modelContent}
            {/* <B /> */}
          </Modal>
        </Portal>
      </Provider>
    </>
  );
}

interface selectProp {
  type: string;
  roommate: string[];
}

const A = () => {
  const [data, setData] = React.useState(true);

  return (
    <TouchableOpacity
      style={{ width: 100, height: 100, backgroundColor: data ? 'red' : 'green' }}
      onPress={() => setData((prevState) => !prevState)}
    ></TouchableOpacity>
  );
};

const B = () => {
  const [value, setValue] = React.useState('first');

  return (
    <RadioButton.Group onValueChange={(value) => setValue(value)} value={value}>
      <RadioButton.Item label="First item" value="first" />
      <RadioButton.Item label="Second item" value="second" />
    </RadioButton.Group>
  );
};

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

const Select = ({ type }: { type: string }) => {
  const appCtx = React.useContext(AppContext);

  const [selectOpponent, setSelectOpponent] = React.useState('');
  const [selectCard, setSelectCard] = React.useState('');

  const cardType = [
    { label: '神父', value: 'priest' },
    { label: '男爵', value: 'baron' },
    { label: '侍女', value: 'homemaid' },
    { label: '王子', value: 'prince' },
    { label: '國王', value: 'king' },
    { label: '伯爵夫人', value: 'countess' },
    { label: '公主', value: 'priness' },
  ];
  return (
    <>
      <Text style={{ color: 'white' }}>請選擇一名對手</Text>

      <RadioButton.Group onValueChange={(value) => setSelectOpponent(value)} value={selectOpponent}>
        {appCtx.roommate.map((item) => (
          <RadioButton.Item key={item} label={item} value={item} />
        ))}
      </RadioButton.Group>

      <Divider style={{ backgroundColor: 'white', marginVertical: 5 }} />
      {type === 'guard' && (
        <>
          <Text style={{ color: 'white' }}>請選擇一種手牌</Text>
          <RadioButton.Group
            onValueChange={(value) => {
              console.log(value);
              setSelectCard(value);
            }}
            value={selectCard}
          >
            {cardType.map((item) => (
              <RadioButton.Item key={item.label} label={item.label} value={item.value} />
            ))}
          </RadioButton.Group>
        </>
      )}
      <Divider style={{ backgroundColor: 'white', marginVertical: 5 }} />
      {/* <View style={{ flex: 1 }}> */}
      <Button icon="check" mode="contained" onPress={() => console.log('Pressed')}>
        確認
      </Button>
      {/* </View> */}
    </>
  );
};
