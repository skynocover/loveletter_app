import React from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { Alert, Platform } from 'react-native';

const url = 'http://192.168.99.162:3002';

export const socketIO = io(Platform.OS === 'web' ? '/' : url);

const home = '/admin';

interface AppContextProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;

  fetch: (method: 'get' | 'post' | 'put' | 'delete', url: string, param?: any) => Promise<any>;

  handCard: string[];
  setHandCard: React.Dispatch<React.SetStateAction<string[]>>;
}

const AppContext = React.createContext<AppContextProps>(undefined!);

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => {
  const [name, setName] = React.useState<string>('');

  const [handCard, setHandCard] = React.useState<string[]>(['guard', 'countess']);

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

  const login = async (account: string, password: string): Promise<any> => {
    const data = await fetch('post', `/api/user/login`, {
      account,
      password,
    });
  };

  const logout = async () => {};

  /////////////////////////////////////////////////////

  return (
    <AppContext.Provider
      value={{
        name,
        setName,

        fetch,

        handCard,
        setHandCard,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppProvider };
