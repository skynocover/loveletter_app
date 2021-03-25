import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Alert, Platform } from 'react-native';

import { Interpreter, AnyEventObject, Machine, interpret } from 'xstate';

const url = 'http://192.168.99.162:3002';
// const url = 'http://192.168.0.113:3002';

export const socketIO = io(Platform.OS === 'web' ? '/' : url);

interface AppContextProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  gameState: string;
  fetch: (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => Promise<any>;
  GameService: Interpreter<
    any,
    any,
    AnyEventObject,
    {
      value: any;
      context: any;
    }
  >;
  handCard: string[];
  setHandCard: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [name, setName] = React.useState<string>('');

  const [gameState, setGameState] = React.useState<string>('beforeStart');

  const [handCard, setHandCard] = React.useState<string[]>([]);

  /////////////////////////////////////////////////////

  React.useEffect(() => {
    axios.defaults.baseURL = Platform.OS === 'web' ? '' : url;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
  }, []);

  const fetch = async (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => {
    let data: any = null;

    try {
      const response = await axios({
        method,
        url,
        data: param,
      });
      console.log('response', response.data);

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error) {
      Alert.alert('fail', error.message);
    }

    return data;
  };

  const GameMachine = Machine({
    id: 'game',
    initial: 'beforeStart',
    states: {
      beforeStart: {
        on: {
          Start: 'roundStart',
        },
      },
      roundStart: {
        on: {
          Ready: { actions: () => {} },
          Start: { target: 'beforeStart', actions: () => {} },
        },
        onEntry: () => {},
        onExit: () => {
          io().emit('Game', 'start');
        }, //退出
      },
    },
  });

  const GameService = interpret(GameMachine)
    .onTransition((state, context) => {})
    .start();

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        name,
        setName,
        gameState,
        fetch,
        GameService,

        handCard,
        setHandCard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

/////////////////// machine ////////////////////
