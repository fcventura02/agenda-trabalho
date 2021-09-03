import Head from "next/head";
import type { NextPage } from "next";
import { formatDate } from "../Date";
import { useFetch } from "@refetty/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { addDays, subDays } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Divider,
  Heading,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { getToken } from "../../config/firebase/client";
import { Header } from "../Header";
import { Loading } from "../Loading";
import format from "date-fns/format";
import { Props } from "framer-motion/types/types";

interface IGetAgenda {
  (when: Date): void;
}

const getAgenda: IGetAgenda = async (when = new Date()) => {
  try {
    const token = await getToken();
    const date = format(when, "yyyy-MM-dd");
    return axios({
      method: "get",
      url: "/api/agenda",
      params: {
        date,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      console.error(error.message);
    });
  } catch (error) {
    console.error(error.message);
  }
};

export const AgendaComponent: NextPage = () => {
  const [when, setWhen] = useState(() => new Date());
  const [data, { loading }, fetch] = useFetch(getAgenda, {
    lazy: true,
  });

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
        <Box w="100%" display="flex" alignItems="center" mt={8} mb={8}>
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
        {loading && <Loading />}
        {data?.map(
          (obj: { time: string; client: { name: string; phone: string } }) => (
            // eslint-disable-next-line react/jsx-key
            <AgendaBlock
              key={obj.time}
              time={obj.time}
              name={obj.client.name}
              phone={obj.client.phone}
              mt={2}
              mb={2}
            />
          )
        )}
      </Container>
    </>
  );
};

const AgendaBlock = ({ time, name, phone, ...props }: Props) => (
  <Box
    maxW="400px"
    w="100%"
    h="100px"
    p={4}
    bg={name ? "blue.500" : "gray.200"}
    borderRadius={8}
    display="flex"
    alignItems="center"
    color={name ? "white" : "blue.200"}
    transition="1s"
    _hover={name && {
      background: "blue.600",
    }}
    {...props}
  >
    <Box w="35%">
      <Text fontSize="2xl">{time}</Text>
    </Box>
    <Divider borderColor={name ? "white" : "blue.200"} orientation="vertical" />
    <Box w="65%" textAlign="end">
      {!name ? (
        <Text fontSize="lg">Horário livre</Text>
      ) : (
        <>
          <Heading fontSize="2xl">{name}</Heading>
          <Text fontSize="lg">{phone}</Text>
        </>
      )}
    </Box>
  </Box>
);
