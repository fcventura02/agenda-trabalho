import { StarIcon } from "@chakra-ui/icons";
import { Flex, Link, Text } from "@chakra-ui/react";

export const Footer = () => {
  return (
    <Flex flexDirection="column" alignItems="center" pt={8} pb={8} bg="blue.600">
      <Text color="white" pb={2}>
        Desenvolvido por
        <Link isExternal href="https://github.com/fcventura02" color="yellowgreen">
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
  );
};
