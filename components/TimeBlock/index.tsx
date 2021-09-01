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
} from "@chakra-ui/react";

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
          <Button variant="ghost" onClick={onClose} marginRight={4}>
            Cancelar
          </Button>
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
    onSubmit: ()=>{},
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
            value={values.name}
            error={errors.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Fulano de Tal"
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
          />
        </Stack>
      </ModalTimeBlock>
    </Button>
  );
};
