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
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [name, setName] = React.useState<string>('');

  const [roomID, setRoomID] = React.useState<string>('none');
  const [gameState, setGameState] = React.useState<string>('beforeStart');

  const [handCard, setHandCard] = React.useState<string[]>([]);
  const [roommate, setRoommate] = React.useState<string[]>([]);

  const [modelVisiable, setModalVisible] = React.useState<boolean>(false);
  const [modelContent, setModelContent] = React.useState<any>(null);

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
      console.log('API response: ', response.data);

      if (response.data.errorCode !== 0) {
        throw new Error(response.data.errorMessage);
      }

      data = response.data;
    } catch (error) {
      Alert.alert('fail', `code: ${error.code}, message: ${error.message}`);
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
          Draw: {
            actions: (context: any, event: any) => {
              let title = event.title;

              setHandCard((prevState: string[]) => {
                let newhandCard = [...prevState, title];
                return newhandCard;
              });
            },
          },
        },
      },
      roundStart: {
        on: {
          Ready: { actions: () => {} },
          ReStart: {
            target: 'beforeStart',
            actions: () => {},
          },
          Draw: {
            actions: (context: any, event: any) => {
              Alert.alert('輪到您了', '', [
                {
                  text: '抽牌',
                  onPress: () => {
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
          },
        },
        onEntry: (context: any, event: any) => {
          let roomID: string = event.roomID;
          let roommate: string[] = event.playersName;
          console.log('playersName: ', roommate);

          setRoomID((prevState: string) => {
            return roomID;
          });
          setRoommate(roommate.filter((item) => item !== name));

          setGameState('roundStart');
        },
        onExit: () => {
          setRoomID('none');
          setGameState('beforeStart');
          setHandCard([]);
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };

/////////////////// machine ////////////////////
