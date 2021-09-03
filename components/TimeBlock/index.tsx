/* eslint-disable react/no-children-prop */
import { useState } from "react";
import { useFormik } from "formik";
import { Input } from "../Input";
import * as yup from "yup";
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
import { format } from "date-fns";

const setSchedule = async (
  time: string,
  data: Date,
  name: string,
  phone: string
) => {
  const date = format(data, "yyyy-MM-dd");
  const username = window.location.pathname.replace("/", "");
  return await axios({
    method: "post",
    url: "/api/schedule",
    data: { time, date, username, name, phone },
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
      <ModalContent w="92%">
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
  date: Date;
  key: string;
  isDisabled: boolean;
  onClick: Function;
}

export const TimeBlock = ({ time, date, isDisabled }: ITimeBlockProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toast = useToast({
    position: "top",
    isClosable: true,
    duration: 3000,
  });
  const toogle = () => setIsOpen((prev) => !prev);
  const submitForm = async (values: { name: string; phone: string }) => {
    try {
      await setSchedule(time, date, values.name, values.phone);
      toast({
        title: `Agendado com sucesso`,
        status: "success",
      });
      toogle();
    } catch (error) {
      toast({
        title: `Erro ao agendar`,
        status: "error",
      });
      console.error(error.message);
    }
  };
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
      name: "",
      phone: "",
    },
    validationSchema: yup.object().shape({
      name: yup.string().required("Preenchimento obrigatório"),
      phone: yup
        .string()
        .required("Preenchimento obrigatório"),
    }),
  });
  return (
    <Button
      disabled={isDisabled}
      padding={8}
      colorScheme="blue"
      onClick={toogle}
    >
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
            placeholder="(99) 9 9999-9999"
            mask={['(99) 9 9999-9999', '(99) 9999-9999']}
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
