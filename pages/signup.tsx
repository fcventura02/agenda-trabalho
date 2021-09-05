/* eslint-disable react/no-children-prop */
import * as yup from "yup";
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Footer, useAuth } from "../components";
import { useEffect } from "react";
import { useFormik } from "formik";
import {
  Container,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  InputLeftAddon,
  InputGroup,
  Button,
  useToast,
} from "@chakra-ui/react";

interface Values {
  email: string;
  password: string;
  user: string;
}

const Signup: NextPage = () => {
  const [auth, { signup }] = useAuth();
  const toast = useToast();
  const router = useRouter();
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("E-mail inválido")
      .required("Preenchimento Obrigatório"),
    password: yup.string().required("Preenchimento Obrigatório"),
    user: yup.string().required("Preenchimento Obrigatório"),
  });

  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    onSubmit: async (values) => {
      await submitForm(values);
    },
    initialValues: {
      email: "",
      password: "",
      user: "",
    },
    validationSchema: validationSchema,
  });

  const submitForm = async (values: Values) => {
    const user = await signup(values.email, values.password, values.user);

    if (user?.message !== undefined) {
      return toast({
        position: "top",
        title: "Não foi possivel cadastrar.",
        description: `${user.message}`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    return toast({
      position: "top",
      title: "Parabéns!!!",
      description: `Agora você faz parte do time da Clocker`,
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

  useEffect(() => {
    auth.user && router.push("/agenda");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user]);

  return (
    <>
      <Container
        maxW="100%"
        minH="100vh"
        pt={4}
        pr={0}
        pl={0}
        display="flex"
        centerContent
        justifyContent="space-between"
      >
        <Box textAlign="center">
          <Image src="/Logo.svg" alt="Vercel Logo" width={225} height={80} />
          <Text mt={10}>Crie sua agenda compartilhada</Text>
        </Box>
        <Box p={4} >
          <FormControl id="email" pt={4} pb={4} isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              size="lg"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {touched.email && (
              <FormHelperText textColor="#e74c3c">
                {errors.email}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl id="password" pt={4} pb={4} isRequired>
            <FormLabel>Senha</FormLabel>
            <Input
              name="password"
              size="lg"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {touched.password && (
              <FormHelperText textColor="#e74c3c">
                {errors.password}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl id="user" pt={4} pb={4} isRequired>
            <InputGroup size="lg">
              <InputLeftAddon children="clocker.com/" />
              <Input
                name="user"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.user}
              />
            </InputGroup>
            {touched.user && (
              <FormHelperText textColor="#e74c3c">{errors.user}</FormHelperText>
            )}
          </FormControl>
          <Button
            width="100%"
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={() => handleSubmit()}
          >
            Cadastrar
          </Button>
          <Box mt={12} textAlign="center">
            <Link href="/">Já possui uma conta? Acesse.</Link>
          </Box>
        </Box>
        <Footer />
      </Container>
    </>
  );
};

export default Signup;
