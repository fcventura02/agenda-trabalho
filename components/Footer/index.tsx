import { StarIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Box w="100%" pt={8} pb={8} bg="blue.600">
      <Flex w="90%" m="auto" flexDirection="column" alignItems="center" textAlign="center">
        <Text color="white" pb={2}>
          Desenvolvido por
          <Link
            isExternal
            href="https://github.com/fcventura02"
            color="yellowgreen"
          >
            {" "}
            <StarIcon color="yellow.500" /> {" DevVentura "}{" "}
            <StarIcon color="yellow.500" />{" "}
          </Link>
          durante um workshop da
          <Link isExternal href="https://codar.me/" color="yellowgreen">
            {" Codar.me "}
          </Link>
        </Text>
        <Link
          isExternal
          href="https://github.com/fcventura02/agenda-trabalho"
          color="yellowgreen"
        >
          Repositório do projeto
        </Link>
      </Flex>
    </Box>
  );
};
