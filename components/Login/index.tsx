/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import * as yup from "yup";
import { useFormik } from "formik";
import {
  Container,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useAuth } from "../Auth";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("E-mail inválido")
    .required("Preenchimento Obrigatório"),
  password: yup.string().required("Preenchimento Obrigatório"),
});

interface Values {
  email: string;
  password: string;
}

export const LoginComponent: NextPage = () => {
  const toast = useToast();
  const [, { login }] = useAuth();
  const {
    values,
    isSubmitting,
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    touched,
  } = useFormik({
    onSubmit: async (values) => {
        await submitForm(values);
    },
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
  });

  const submitForm = async (values: Values) => {
    const success = await login(values.email, values.password);

    if (success.message !== undefined) {
      return toast({
        position: "top",
        title: "Não foi possível acessar sua conta.",
        description: `Email ou senha inválidos`,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
    return toast({
      position: "top",
      title: "Acesso confirmado!",
      status: "success",
      duration: 4000,
      isClosable: true,
    });
  };

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
          <Button
            type="submit"
            width="100%"
            isLoading={isSubmitting}
            colorScheme="blue"
            onClick={() => handleSubmit()}
          >
            Entrar
          </Button>
        </Box>
        <Box mt={12}>
          <Link href="/signup">Ainda não tem uma conta? Cadastre-se.</Link>
        </Box>
      </Container>
    </>
  );
};
