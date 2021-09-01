import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import { useFetch } from "@refetty/react";
import { Props, useEffect, useState } from "react";
import { addDays, subDays } from "date-fns";
import { formatDate, Header, useAuth } from "../components";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Container,
  IconButton,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { Loading } from "../components";
import { AppProps } from "next/dist/shared/lib/router/router";

interface IGetSchedule {
  (when: Date): void;
}

const getSchedule: IGetSchedule = async (when = new Date()) => {
  const username = window.location.pathname;
  return axios({
    method: "get",
    url: "/api/schedule",
    params: {
      when,
      username,
    },
  });
};

export default function Schedule() {
  const [when, setWhen] = useState(() => new Date());
  const [data, { loading, status, error }, fetch] = useFetch(
    (token: string, date = when) => getSchedule(date),
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
        <SimpleGrid w="100%" textAlign="center" flex={1} columns={2} spacing={4}>
          {loading && <Loading />}
          {data?.map((time: string, index: string) => (
            <TimeBlock key={index} time={time} />
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

interface ITimeBlockProps {
  time: string;
  key: string;
}

const TimeBlock = ({ time }: ITimeBlockProps) => {
  return (
    <Button padding={8} colorScheme="blue">
      <Text fontSize="2xl">{time}</Text>
    </Button>
  );
};
