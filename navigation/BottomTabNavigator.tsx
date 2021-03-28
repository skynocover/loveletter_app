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
      // console.log('draw card', title);
      // console.log('card now: ', appCtx.handCard);
      appCtx.GameService.send('Draw', { title });
      // appCtx.setHandCard((prevState: string[]) => {
      //   let newhandCard = [...prevState, title];
      //   console.log(newhandCard);
      //   return newhandCard;
      // });
    });

    socketIO.on('Game', async (state: string, roomID: string, playersName: string[]) => {
      // console.log('socket Game state: ', state);
      // console.log('socket Game roomID: ', roomID);

      appCtx.GameService.send(state, { roomID, playersName });
      if (state === 'Start') {
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
      }
    });
  }, []);

  const getName = () => appCtx.name;

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
