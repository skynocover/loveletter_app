import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Alert, FlatList, RefreshControl } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Icon } from '../components/Icon';

import { AppContext, socketIO } from '../appcontext';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import HandleCardScreen from '../screens/HandCardScreen';
import BoardScreen from '../screens/BoardScreen';
import HistoryScreen from '../screens/HistoryScreen';
import RuleScreen from '../screens/RuleScreen';
import TargetCardScreen from '../screens/TargetCardScreen';
import {
  BottomTabParamList,
  HandCardParamList,
  BoardParamList,
  HistoryParamList,
  RuleParamList,
} from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const appCtx = React.useContext(AppContext);

  const colorScheme = useColorScheme();

  const navigation = useNavigation<StackNavigationProp<any>>();

  React.useEffect(() => {
    socketIO.on('disconnect', () => {
      // navigation.push('Board');
      console.log('return to board');
    });

    socketIO.on('draw', (title: string) => {
      appCtx.GameService.send('Draw', { title });
    });

    socketIO.on('result', (action: string, name: string) => {
      switch (action) {
        case 'out':
          if (name !== appCtx.name) {
            appCtx.setSnackContent(`${name} out of the game!`);
            appCtx.setSnackBarVisible(true);
          } else {
          }
          break;

        case 'peek':
          appCtx.setSnackContent(`Hand card is ${name}`);
          appCtx.setSnackBarVisible(true);
          break;
        case 'baron out':
          appCtx.setSnackContent(`${name} lose by baron`);
          appCtx.setSnackBarVisible(true);
          break;
        case 'prince':
          appCtx.setSnackContent(`draw card:${name} by prince`);
          appCtx.setHandCard([name]);
          appCtx.setSnackBarVisible(true);
          break;
        case 'king':
          appCtx.setSnackContent(`change card:${name} by king`);
          appCtx.setHandCard([name]);
          appCtx.setSnackBarVisible(true);
          break;
        case 'priness':
          appCtx.setSnackContent(`${name} lose by play the priness`);
          appCtx.setSnackBarVisible(true);
          if (name === appCtx.name) {
            appCtx.GameService.send('End');
          }

          break;
        default:
          break;
      }
    });

    socketIO.on('end', (winner: any[]) => {
      let winn: string = '';
      for (const p of winner) {
        winn = `${winn} ${p.name}`;
      }
      appCtx.setSnackContent(`${winn.trim()} win the game!`);
      appCtx.setSnackBarVisible(true);
    });

    socketIO.on('playCard', (player: string, card: string) => {
      if (player !== appCtx.name) {
        appCtx.setSnackContent(`${player} play card: ${card}`);
        appCtx.setSnackBarVisible(true);
      }
    });

    socketIO.on('Game', async (state: string, roomID: string, playersName: string[]) => {
      if (state === 'Start') {
        appCtx.GameService.send(state, { roomID, playersName });
        Alert.alert('遊戲開始', '確認', [
          {
            text: 'OK',
            onPress: async () => {
              await appCtx.fetch('post', '/api/game/ready', {
                roomID: roomID,
                playerID: socketIO.id,
              });
            },
          },
        ]);
      } else {
        appCtx.GameService.send(state);
      }
    });
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="Board"
      tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}
    >
      <BottomTab.Screen
        name="HandCard"
        component={HandCardNavigator}
        options={{
          // tabBarIcon: ({ color }) => (
          //   <Icon name={'MaterialCommunityIcons/cards'} color={'black'} size={30} />
          // ),
          tabBarIcon: ({ color }) => <TabBarIcon name="people-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Board"
        component={BoardNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="albums-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="History"
        component={HistoryNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="albums-outline" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Rule"
        component={RuleNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="document-text" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HandCardStack = createStackNavigator<HandCardParamList>();

function HandCardNavigator() {
  return (
    <HandCardStack.Navigator>
      <HandCardStack.Screen
        name="HandleCardScreen"
        component={HandleCardScreen}
        options={{ headerShown: false }}
      />
      <HandCardStack.Screen
        name="TargetCardScreen"
        component={TargetCardScreen}
        options={{ headerShown: false }}
      />
    </HandCardStack.Navigator>
  );
}
const BoardStack = createStackNavigator<BoardParamList>();

function BoardNavigator() {
  return (
    <BoardStack.Navigator>
      <BoardStack.Screen
        name="BoardScreen"
        component={BoardScreen}
        options={{ headerShown: false }}
      />
    </BoardStack.Navigator>
  );
}

const HistoryStack = createStackNavigator<HistoryParamList>();

function HistoryNavigator() {
  return (
    <HistoryStack.Navigator>
      <HistoryStack.Screen
        name="HistoryScreen"
        component={HistoryScreen}
        options={{ headerShown: false }}
      />
    </HistoryStack.Navigator>
  );
}

const RuleStack = createStackNavigator<RuleParamList>();

function RuleNavigator() {
  return (
    <RuleStack.Navigator>
      <RuleStack.Screen name="RuleScreen" component={RuleScreen} options={{ headerShown: false }} />
    </RuleStack.Navigator>
  );
}
