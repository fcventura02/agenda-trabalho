/* eslint-disable react/no-children-prop */
import { useState } from "react";
import { useFormik } from "formik";
import { Input } from "../Input";
import * as yup from "yup";
import "yup-phone";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const setSchedule = async (when: string, name: string, phone: string) => {
  const username = window.location.pathname.replace("/", "");
  return await axios({
    method: "post",
    url: "/api/schedule",
    params: { when, username, name, phone },
  });
};

interface IModalTimeBlockProps {
  isOpen: boolean;
  isSubmiting: boolean;
  time: string;
  onClose: () => void;
  onComplet: () => void;
  children: React.ReactNode;
}

export const ModalTimeBlock = ({
  time,
  isOpen,
  isSubmiting,
  onClose,
  onComplet,
  children,
}: IModalTimeBlockProps) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Agendar horário para {time}h</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>{children}</ModalBody>
        <ModalFooter>
          {!isSubmiting && (
            <Button variant="ghost" onClick={onClose} marginRight={4}>
              Cancelar
            </Button>
          )}
          <Button
            isLoading={isSubmiting}
            colorScheme="blue"
            onClick={onComplet}
          >
            Reservar horário
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

interface ITimeBlockProps {
  time: string;
  key: string;
  onClick: Function;
}

export const TimeBlock = ({ time }: ITimeBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast();
  const toogle = () => setIsOpen((prev) => !prev);
  const {
    values,
    handleSubmit,
    handleBlur,
    handleChange,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    onSubmit: async (values, form) => {
      try {
        await setSchedule(time, values.name, values.phone);
        toast({
          title: `Agendado com sucesso`,
          position: "top",
          status: "success",
          isClosable: true,
          duration: 3000,
        });
        toogle();
      } catch (error) {
        toast({
          title: `Erro ao agendar`,
          position: "top",
          status: "error",
          isClosable: true,
        });
        console.error(error.message);
      }
    },
    initialValues: {
      name: "",
      phone: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Preenchimento obrigatório"),
      phone: yup
        .string()
        .phone("BR", true, "Número de telefone inválido")
        .required("Preenchimento obrigatório"),
    }),
  });
  return (
    <Button padding={8} colorScheme="blue" onClick={toogle}>
      <Text fontSize="2xl">{time}</Text>
      <ModalTimeBlock
        time={time}
        isOpen={isOpen}
        onClose={toogle}
        onComplet={handleSubmit}
        isSubmiting={isSubmitting}
      >
        <Stack spacing={4}>
          <Input
            touched={touched.name}
            children="Nome"
            name="name"
            type="text"
            placeholder="Fulano de Tal"
            value={values.name}
            error={errors.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
          <Input
            touched={touched.phone}
            children="Telefone"
            name="phone"
            type="number"
            placeholder="(99) 9 9999-9999"
            value={values.phone}
            error={errors.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isSubmitting}
          />
        </Stack>
      </ModalTimeBlock>
    </Button>
  );
};
