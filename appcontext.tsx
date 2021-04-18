import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Alert, Platform } from 'react-native';

import { Interpreter, AnyEventObject, Machine, interpret } from 'xstate';

// const url = 'http://192.168.99.162:3002';
const url = 'http://192.168.0.113:3002';

export const socketIO = io(Platform.OS === 'web' ? '/' : url);

interface AppContextProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
  roomID: string;
  setRoomID: React.Dispatch<React.SetStateAction<string>>;
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
  roommate: string[];
  modelVisiable: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  modelContent: any;
  setModelContent: React.Dispatch<any>;
  snackVisiable: boolean;
  setSnackBarVisible: React.Dispatch<React.SetStateAction<boolean>>;
  snackContent: string;
  setSnackContent: React.Dispatch<React.SetStateAction<string>>;
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
  getCard: () => Promise<void>;
  regist: () => Promise<void>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [name, setName] = React.useState<string>('');

  const [roomID, setRoomID] = React.useState<string>('none');
  const [gameState, setGameState] = React.useState<string>('beforeStart');

  const initHandCard = [
    'guard',
    'priest',
    'baron',
    'handmaid',
    'prince',
    'king',
    'countess',
    'priness',
  ];
  const [handCard, setHandCard] = React.useState<string[]>(initHandCard);
  const [roommate, setRoommate] = React.useState<string[]>([]);

  const [modelVisiable, setModalVisible] = React.useState<boolean>(false);
  const [modelContent, setModelContent] = React.useState<any>(null);

  const [snackVisiable, setSnackBarVisible] = React.useState<boolean>(false);
  const [snackContent, setSnackContent] = React.useState<string>('');

  const [login, setLogin] = React.useState<boolean>(false);

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
      console.log(`API ${url} response: ${JSON.stringify(response.data)}`);

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error) {
      Alert.alert('fail', `code: ${error.code}, message: ${error.message}`);
    }

    return data;
  };

  const getCard = async () => {
    let data = await fetch('post', '/api/game/getCard', {
      id: socketIO.id,
      roomID: roomID,
    });
    if (data) {
      setHandCard((prevState: string[]) => {
        let newhandCard = [...data.handCard];
        console.log('after get card', newhandCard);
        return [...data.handCard];
      });
    }
  };

  const regist = async () => {
    if (name === '') {
      Alert.alert('請輸入使用者名稱');
      return;
    }
    let data = await fetch('post', '/api/players', {
      player: { id: socketIO.id, name: name },
    });
    if (data) {
      setLogin(true);
    }
  };

  const GameMachine = Machine(
    {
      id: 'game',
      initial: 'beforeStart',
      states: {
        beforeStart: {
          on: {
            Start: 'roundStart',
            Draw: {
              actions: (context: any, event: any) => {
                setHandCard((prevState: string[]) => {
                  let newhandCard = [event.title];
                  return newhandCard;
                });
              },
            },
          },
        },
        roundStart: {
          on: {
            ReStart: {
              target: 'beforeStart',
              actions: ['restart'],
            },
            Draw: { actions: ['draw'] },
            End: 'End',
          },
          onEntry: (context: any, event: any) => {
            let roomID: string = event.roomID;
            let roommate: string[] = event.playersName;

            setRoomID((prevState: string) => {
              return roomID;
            });
            setRoommate(roommate);
            setGameState('roundStart');
          },
          onExit: () => {}, //退出
        },
        End: {
          on: {
            ReStart: {
              target: 'beforeStart',
              actions: ['restart'],
            },
          },

          onEntry: (context: any, event: any) => {
            setGameState('End');
          },
        },
      },
    },
    {
      actions: {
        draw: async (context, event) => {
          Alert.alert('輪到您了', '', [
            {
              text: '抽牌',
              onPress: async () => {
                let title = event.title;
                setHandCard((prevState: string[]) => {
                  let newhandCard = [...prevState, title];
                  console.log('after draw card', newhandCard);
                  return newhandCard;
                });
              },
            },
          ]);
        },
        restart: () => {
          setRoomID('none');
          setGameState('beforeStart');
          setHandCard(initHandCard);
        },
      },
    },
  );

  const GameService = interpret(GameMachine)
    .onTransition((state, context) => {})
    .start();

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        name,
        setName,
        roomID,
        setRoomID,
        gameState,
        fetch,
        GameService,

        handCard,
        setHandCard,

        roommate,
        modelVisiable,
        setModalVisible,
        modelContent,
        setModelContent,

        snackVisiable,
        setSnackBarVisible,
        snackContent,
        setSnackContent,
        login,
        setLogin,
        getCard,
        regist,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
