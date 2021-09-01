import Head from "next/head";
import type { NextPage } from "next";
import { formatDate } from "../Date";
import { useFetch } from "@refetty/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { addDays, subDays } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Container, IconButton } from "@chakra-ui/react";
import { getToken } from "../../config/firebase/client";
import { Header } from "../Header";

interface IGetAgenda {
  (when: Date): void;
}

const getAgenda: IGetAgenda = async (when = new Date()) => {
  const token = await getToken();
  return axios({
    method: "get",
    url: "/api/agenda",
    params: {
      when,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const AgendaComponent: NextPage = () => {
  const [when, setWhen] = useState(() => new Date());
  const [data, { loading, status, error }, fetch] = useFetch(
    (token: string, date = when) => getAgenda(date),
    { lazy: true }
  );

  useEffect(() => {
    fetch(when);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when]);

  const backDay = () => setWhen((prevState) => subDays(prevState, 1));

  const nextDay = () => setWhen((prevState) => addDays(prevState, 1));

  return (
    <>
      <Head>
        <title>Clocker | Agenda</title>
      </Head>
      <Container maxW="760px" minH="100vh" p={4} centerContent>
        <Header />
        <Box w="100%" display="flex" alignItems="center" mt={8}>
          <IconButton
            bg="transparent"
            aria-label="back date"
            icon={<ChevronLeftIcon />}
            onClick={backDay}
          />
          <Box flex={1} textAlign="center">
            {formatDate(when, "PPPP")}
          </Box>
          <IconButton
            bg="transparent"
            aria-label="next date"
            icon={<ChevronRightIcon />}
            onClick={nextDay}
          />
        </Box>
      </Container>
    </>
  );
};
