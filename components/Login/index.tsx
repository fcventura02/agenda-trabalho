/* eslint-disable react/no-children-prop */
import type { NextPage } from "next";
import Link from "next/link";
import Image from "next/image";
import * as yup from "yup";
import { Form, Formik, FormikHelpers } from "formik";
import {
  Container,
  Box,
  Text,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Button,
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
  email: "";
  password: "";
}

export const LoginComponent: NextPage = () => {
  const [, { login }] = useAuth();
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
            }}
            onSubmit={(values: Values, actions: FormikHelpers<Values>) => {
              login(values.email, values.password);
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
          <Link href="/signup">Ainda não tem uma conta? Cadastre-se.</Link>
        </Box>
      </Container>
    </>
  );
};
