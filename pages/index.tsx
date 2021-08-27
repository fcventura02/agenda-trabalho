import { useEffect, useState } from "react";
import {} from "firebase";
import { Login, Agenda } from "../components";
import firebase from "../config/firebase";
import { Container, Spinner } from "@chakra-ui/react";

interface Istate {
  loading: boolean;
  user: boolean | any;
}

export default function Home() {
  const [auth, setAuth] = useState<Istate>({
    loading: true,
    user: false,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      setAuth({
        loading: false,
        user,
      });
    });
  }, []);

  if (auth.loading) {
    return (
      <Container
        minH="100vh"
        centerContent
        justifyContent="center"
      >
        <Spinner w={100} h={100}/>
      </Container>
    );
  }
  return auth.user ? <Agenda /> : <Login />;
}
