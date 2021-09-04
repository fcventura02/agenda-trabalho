import { Box, Button, Link as LinkStyled } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../Auth";

export const Header = ({ isLoged = true }) => {
  const [, { logout }] = useAuth();
  return (
    <Box
      w="100%"
      display="flex"
      justifyContent={isLoged ? "space-between" : "center"}
      alignItems="center"
    >
      <LinkStyled>
        <Link href="/" passHref>
          <Image src="/Logo.svg" alt="Vercel Logo" width={130} height={40} />
        </Link>
      </LinkStyled>
      {isLoged && (
        <Button colorScheme="blue" onClick={logout}>
          Sair
        </Button>
      )}
    </Box>
  );
};
