import { Container, Spinner } from "@chakra-ui/react";
import { useAuth } from "../components";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Home");
    if (!auth.loading) {
      auth.user ? router.push("/agenda") : router.push("/login");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  return (
    <Container minH="100vh" centerContent justifyContent="center">
      <Spinner w={100} h={100} />
    </Container>
  );
}
