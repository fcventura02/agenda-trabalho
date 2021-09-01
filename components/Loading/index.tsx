import { Center, Container } from "@chakra-ui/react";
import Image from "next/image";

export const Loading = () => {
  return (
    <Center w="100%" h="100%" display="flex" flex={1}>
      <Image src="/loading.svg" alt="Loading" width="100%" height="100%" />
    </Center>
  );
};
