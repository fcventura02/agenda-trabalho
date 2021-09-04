import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { firebaseClient, persistenceMode } from "../../config/firebase";
import axios from "axios";

interface Istate {
  loading: boolean;
  user: boolean | any;
}

const AuthContext = React.createContext<[any, any]>([{}, () => {}]);

export const useAuth = () => {
  const [auth] = useContext(AuthContext);
  return [auth, { login, logout, signup }];
};

export const login = async (email: string, password: string) => {
  try {
    await firebaseClient.auth().signInWithEmailAndPassword(email, password);
    firebaseClient.auth().setPersistence(persistenceMode);
    return firebaseClient.auth().currentUser;
  } catch (error) {
    console.error("Login: ", error.message);
    return error;
  }
};

export const logout = () => {
  firebaseClient.auth().signOut();
};

export const signup = async (
  email: string,
  password: string,
  username: string
) => {
  try {
    await axios({
      method: "get",
      url: "/api/profile",
      params: {
        username,
      },
    });
    await firebaseClient.auth().createUserWithEmailAndPassword(email, password);
    const user = await login(email, password);
    const token = await user?.getIdToken();
    //setupProfile(token, username)
    await axios({
      method: "post",
      url: "/api/profile",
      data: {
        email,
        username,
      },
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    return user;
  } catch (error) {
    console.log(error)
    return error;
  }
};

export const AuthProvider: NextPage = ({ children }) => {
  const [auth, setAuth] = useState<Istate>({
    loading: true,
    user: false,
  });
  useEffect(() => {
    const unsubscribe = firebaseClient.auth().onAuthStateChanged((user) => {
      setAuth({
        loading: false,
        user,
      });
    });
    return () => unsubscribe();
  }, []);
  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};
