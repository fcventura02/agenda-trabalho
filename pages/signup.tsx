/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Image from "next/image";
import * as yup from "yup";
import { firebaseClient } from "../config/firebase";
import { Form, Formik, FormikHelpers } from "formik";
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
} from "@chakra-ui/react";
import Link from "next/link";
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("E-mail inválido")
    .required("Preenchimento Obrigatório"),
  password: yup.string().required("Preenchimento Obrigatório"),
  user: yup.string().required("Preenchimento Obrigatório"),
});

interface Values {
  email: "";
  password: "";
  user: "";
}

const Home: NextPage = () => {
  const signup = async (email: string, password: string) => {
    try {
      const user = firebaseClient
        .auth()
        .createUserWithEmailAndPassword(email, password);
      return user;
    } catch (error) {
      console.log(error.message);
    }
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
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              email: "",
              password: "",
              user: "",
            }}
            onSubmit={(values: Values, actions: FormikHelpers<Values>) => {
              signup(values.email, values.password)
                .then((res) => {
                  console.log(res);
                })
                .catch((error) => console.error(error.message));
            }}
          >
            {({
              values,
              errors,
              touched,
              isSubmitting,
              handleChange,
              handleBlur,
            }) => (
              <Form>
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
                    <FormHelperText textColor="#e74c3c">
                      {errors.user}
                    </FormHelperText>
                  )}
                </FormControl>
                <Button
                  type="submit"
                  width="100%"
                  isLoading={isSubmitting}
                  colorScheme="blue"
                >
                  Entrar
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
        <Box mt={12}>
          <Link href="/">Já possui uma conta? Acesse.</Link>
        </Box>
      </Container>
    </>
  );
};

export default Home;
