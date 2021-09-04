import { Container, Spinner } from "@chakra-ui/react";
import { useAuth } from "../components";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Image from "next/image";

export default function Home() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.loading) {
      auth.user ? router.push("/agenda") : router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  return (
    <Container minH="100vh" centerContent justifyContent="center">
      <Image src="/loading.svg" alt="Loading" width={290} height={80} />
    </Container>
  );
}
