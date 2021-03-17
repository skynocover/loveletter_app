import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Alert } from 'react-native';

export const socketIO = io('http://192.168.99.162:3002');

const home = '/admin';

interface AppContextProps {
  loginPage: string;
  homePage: string;
  setModal: (modal: any) => void;

  account: string;
  setAccount: (value: string) => void;
  isAdmin: boolean;
  setIsAdmin: (value: boolean) => void;

  fetch: (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => Promise<any>;

  login: (account: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  redirect: () => Promise<void>;
  socket: SocketIOClient.Socket;
  handCard: string[];
  setHandCard: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [loginPage] = React.useState('/#/login');
  const [homePage] = React.useState('/#/contactus');
  const [modal, setModal] = React.useState<any>(null);
  const [socket, setSocket] = React.useState<SocketIOClient.Socket>(socketIO);

  const [account, setAccount] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState(false);

  const [handCard, setHandCard] = React.useState<string[]>(['guard', 'countess']);

  /////////////////////////////////////////////////////

  React.useEffect(() => {
    axios.defaults.baseURL = 'http://192.168.99.162:3002';
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    // socketIO.on('welcome', () => {
    //   Alert.alert('ok?', 'ok!!!');
    //   // socketIO.emit('msg', { aaa: 'bbb' });
    // });
    // setSocket(socketIO);
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
    } catch (error) {}

    return data;
  };

  const redirect = async () => {
    const data = await fetch('get', '/api/user/verify');
    if (data) {
      setAccount(data.account);
    }

    // const data = false;
    window.location.href = data ? home + homePage : home + loginPage;
  };

  const login = async (account: string, password: string): Promise<any> => {
    const data = await fetch('post', `/api/user/login`, {
      account,
      password,
    });

    if (data) {
      if (data.errorCode === 0) {
        window.location.href = home + homePage;
      } else {
        window.location.href = home + loginPage;
      }
    } else {
      window.location.href = home + loginPage;
    }
  };

  const logout = async () => {
    await fetch('post', '/api/user/logout', {});
    window.location.href = home + loginPage;
  };

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        loginPage,
        homePage,
        setModal: (modal: any) => setModal(modal),

        account,
        setAccount,
        isAdmin,
        setIsAdmin,

        fetch,

        login,
        logout,
        redirect,

        handCard,
        setHandCard,

        socket,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
