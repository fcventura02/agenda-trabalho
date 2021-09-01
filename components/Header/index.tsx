import { Box, Button } from "@chakra-ui/react";
import Image from "next/image";
import { useAuth } from "../Auth";

export const Header = () => {
  const [, { logout }] = useAuth();
  return (
    <Box
      w="100%"
      justifyContent="space-between"
      display="flex"
      alignItems="center"
    >
      <Image src="/Logo.svg" alt="Vercel Logo" width={130} height={40} />
      <Button colorScheme="blue" onClick={logout}>
        Sair
      </Button>
    </Box>
  );
};
