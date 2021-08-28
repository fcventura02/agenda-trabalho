import React, { useContext, useEffect, useState } from "react";
import type { NextPage } from "next";
import { firebaseClient, persistenceMode } from "../../config/firebase";

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
    const user = await firebaseClient
      .auth()
      .signInWithEmailAndPassword(email, password);
    firebaseClient.auth().setPersistence(persistenceMode);
  } catch (error) {
    console.error("Login: ", error.message);
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
    const user = await firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password);
    login(email, password);
    //setupProfile(token, username)
    /* 		const { data } = await axios({
			method: "post",
			url: "/api/profile",
			data: {
				username: values.user,
			},
			headers: {
				Authentication: `Bearer ${res.user.getToken()}`,
			},
		}); */
    return user;
  } catch (error) {
    console.error("Signup: ", error.message);
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
