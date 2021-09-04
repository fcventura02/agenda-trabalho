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
      submitForm(values);
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
        maxW="960px"
        minH="100vh"
        p={4}
        centerContent
        justifyContent="center"
      >
        <Image src="/Logo.svg" alt="Vercel Logo" width={290} height={80} />
        <Box mt={12}>
          <Text>Crie sua agenda compartilhada</Text>
        </Box>
        <Box p={4} mt={12}>
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
        </Box>
        <Box mt={12}>
          <Link href="/">Já possui uma conta? Acesse.</Link>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Signup;
