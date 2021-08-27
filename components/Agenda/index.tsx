import { Button, Container } from "@chakra-ui/react";
import type { NextPage } from "next";
import firebase from "../../config/firebase";
import Head from "next/head";
import Image from "next/image";

export const Agenda: NextPage = () => {
  const logout = ()=>firebase.auth().signOut()
  return (
    <>
      <Head>
        <title>Clocker | Agenda</title>
      </Head>
      <Container
        maxW="960px"
        minH="100vh"
        p={4}
        centerContent
        justifyContent="center"
      >
        <Image src="/Logo.svg" alt="Vercel Logo" width={290} height={80} />
      <Button onClick={logout}>Sair</Button>
      </Container>
    </>
  );
};