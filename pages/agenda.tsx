import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { AgendaComponent, useAuth } from "../components";

const Agenda: NextPage = () => {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    !auth.user && router.push("/");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);
  return ( 
    <>
      <Head>
        <title>Clocker | Agenda</title>
      </Head>
      <AgendaComponent />
    </>
  );
};

export default Agenda;
