import * as React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Appbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Carousel } from '../_components/Carousel'; // Version can be specified in package.json
import HandleCard from '../components/HandleCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { socketIO, AppContext } from '../appcontext';

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

  const _handleMore = () => {
    console.log(`Target indtx: ${targetIndex}`);
    socketIO.emit('msg', { aaa: 'bbb', id: socketIO.id });
    // console.log(_carousel.current.currentIndex);
    getHandCard();
    // setHandCard(handCard.splice(_carousel.current.currentIndex - 1, 1));
  };

  const onSnap = (index: number) => {
    setTargetIndex(index);
    // console.log(index);
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
