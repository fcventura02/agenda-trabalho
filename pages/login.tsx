import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoginComponent, useAuth } from "../components";

export default function Login() {
  const [auth] = useAuth();
  const router = useRouter();

  useEffect(() => {
    auth.user && router.push("/agenda");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);
  return (
    <>
      <Head>
        <title>Clocker | Login</title>
      </Head>
      <LoginComponent />
    </>
  );
}
