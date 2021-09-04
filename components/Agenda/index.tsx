import Head from "next/head";
import type { NextPage } from "next";
import { formatDate } from "../Date";
import { useFetch } from "@refetty/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { addDays, subDays } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  IconButton,
  Link,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
  useClipboard,
  useMediaQuery,
} from "@chakra-ui/react";
import { getToken } from "../../config/firebase/client";
import { Header } from "../Header";
import { Loading } from "../Loading";
import format from "date-fns/format";
import { Props } from "framer-motion/types/types";

interface IGetAgenda {
  (when: Date): void;
}

export const AgendaComponent: NextPage = () => {
  const [userName, setUserName] = useState("");
  const [valueCopy, setValueCopy] = useState("");
  const [dia, setDia] = useState("do dia");
  const { hasCopied, onCopy } = useClipboard(valueCopy);
  const [isMobile] = useMediaQuery("(min-width: 490px)");
  const [when, setWhen] = useState(() => new Date());
  const date = new Date();
  const getAgenda: IGetAgenda = async (when = new Date()) => {
    try {
      const token = await getToken();
      if (!token) return;
      const date = format(when, "yyyy-MM-dd");
      const result = await axios({
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
      userName === "" && setUserName(result?.data.username);
      return result;
    } catch (error) {
      return error;
    }
  };

  const [data, { loading }, fetch] = useFetch(getAgenda, {
    lazy: true,
  });

  useEffect(() => {
    fetch(when);
    setValueCopy(window?.location.host + "/" + userName);
    if (date.getDate() > when.getDate()) {
      setDia("dos dia anteriores");
    } else if (date.getDate() < when.getDate()) {
      setDia("dos próximos dia");
    } else {
      setDia("do dia");
    }
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
        <Box
          w="100%"
          pt={4}
          display="flex"
          justifyContent="space-between"
          flexDirection={isMobile ? "row" : "column"}
        >
          <Box>
            <Heading>Bem vindo, {userName}</Heading>
            <Text>Aqui está sua agenda {dia}!</Text>
          </Box>
          <Box>
            <Tooltip
              isOpen={hasCopied}
              hasArrow
              label="Link copiado!"
              bg="blue.600"
              placement="bottom"
            >
              <Button onClick={onCopy}>
                Compartilhe seu link
                <LinkIcon ml={4} />
              </Button>
            </Tooltip>
          </Box>
        </Box>
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
        {data?.agenda.map(
          (obj: { time: string; client: { name: string; phone: string } }) => (
            // eslint-disable-next-line react/jsx-key
            <AgendaBlock
              key={obj.time}
              time={obj.time}
              name={obj.client.name}
              phone={obj.client.phone}
              isMobile={isMobile}
              mt={2}
              mb={2}
            />
          )
        )}
      </Container>
    </>
  );
};

const AgendaBlock = ({ time, name, phone, isMobile, ...props }: Props) => {
  const BoxLink = ({ ...props }: Props) =>
    phone ? (
      <Tooltip
        hasArrow
        label="click para entrar em contado"
        bg="blue.600"
        placement="top"
      >
        <Link href={`tel:${phone}`} isExternal {...props}>
          {props.children}
        </Link>
      </Tooltip>
    ) : (
      <Box {...props}> {props.children}</Box>
    );
  return (
    <BoxLink
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
      _hover={
        name && {
          background: "blue.600",
        }
      }
      {...props}
    >
      <Box w="27%">
        <Text fontSize="2xl">{time}</Text>
      </Box>
      <Divider
        borderColor={name ? "white" : "blue.200"}
        orientation="vertical"
      />
      <Box w="73%" textAlign="end">
        {!name ? (
          <Text fontSize="lg">Horário livre</Text>
        ) : (
          <>
            <Heading fontSize={isMobile ? "2xl" : "1xl"} noOfLines={1}>
              {name}
            </Heading>
            <Text fontSize="lg" pt={2}>
              {phone}
            </Text>
          </>
        )}
      </Box>
    </BoxLink>
  );
};
