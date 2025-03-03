import { getInfo } from '@/apis/authService';
import Cookies from 'js-cookie';
import { createContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userId, setUserId] = useState(Cookies.get('userId'));

  const handleLogOut = () => {
    Cookies.remove('token');
    Cookies.remove('refreshToken');
    Cookies.remove('userId');
    setUserInfo(null);
    window.location.reload();
  }

  useEffect(() => {
    if (userId) {
      getInfo(userId)
        .then((res) => {
          setUserInfo(res.data);
        })
        .catch((error) => {
          toast.error('Error getting user info');
        });
    }
  }, [userId]);

  return (
    <StoreContext.Provider value={{ userInfo, handleLogOut, setUserId }}>
      {children}
    </StoreContext.Provider>
  );
};
