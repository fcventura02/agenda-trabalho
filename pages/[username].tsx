import axios from "axios";
import Head from "next/head";
import { useFetch } from "@refetty/react";
import { useEffect, useState } from "react";
import { addDays, format, subDays } from "date-fns";
import { formatDate, Header, TimeBlock } from "../components";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Box, Container, IconButton, SimpleGrid } from "@chakra-ui/react";
import { Loading } from "../components";
import { useRouter } from "next/router";

interface IGetSchedule {
  (when: Date | number, username: string): any;
}

const getSchedule: IGetSchedule = async (
  when = new Date(),
  username: string
) => {
  const date = format(when, "yyyy-MM-dd");
  if (!username) {
    return;
  }
  try {
    return await axios({
      method: "get",
      url: "/api/schedule",
      params: {
        date,
        username,
      },
    });
  } catch (error) {
    return error;
  }
};

export default function Schedule() {
  const router = useRouter();
  const [when, setWhen] = useState(() => new Date());
  const username = router.query.username;
  const [data, { loading }, fetch] = useFetch(getSchedule, {
    lazy: true,
  });

  const backDay = () => setWhen((prevState) => subDays(prevState, 1));
  const nextDay = () => setWhen((prevState) => addDays(prevState, 1));
  const isBackDay = () => {
    const day = new Date();
    return subDays(when, 1) < day && when < day;
  };

  useEffect(() => {
    fetch(when, username);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [when, router.query.username]);
  return (
    <>
      <Head>
        <title>Clocker | Agenda</title>
      </Head>
      <Container maxW="760px" minH="100vh" p={4} centerContent>
        <Header />
        <Box w="100%" display="flex" alignItems="center" mt={8} mb={8}>
          <IconButton
            isDisabled={isBackDay()}
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
        <SimpleGrid
          w="100%"
          textAlign="center"
          flex={1}
          alignContent="center"
          columns={2}
          spacing={4}
        >
          {data?.map(
            (obj: { isBlocked: boolean; time: string }, index: string) => (
              <TimeBlock
                isDisabled={obj.isBlocked}
                key={index}
                time={obj.time}
                date={when}
                onClick={open}
              />
            )
          )}
        </SimpleGrid>
      </Container>
    </>
  );
}
