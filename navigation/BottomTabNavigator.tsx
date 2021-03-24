import { Ionicons } from '@expo/vector-icons';
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
      appCtx.setHandCard([...appCtx.handCard, title]);
    });

    socketIO.on('gameState', (state: string) => {
      appCtx.GameService.send(state);
    });
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="HandCard"
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
