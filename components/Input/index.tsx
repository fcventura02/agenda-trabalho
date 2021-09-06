/* eslint-disable react/no-children-prop */
import { mask, unMask } from "remask";
import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input as InPutBase,
  FormHelperText,
} from "@chakra-ui/react";
import { Props } from "framer-motion/types/types";

interface IInputProps {
  value: string;
  name: string;
  type?: string;
  children: string;
  error?: string;
  placeholder: string;
  touched?: boolean;
  onChange: any;
  onBlur: any;
  disabled: boolean;
  mask?: string[];
}

export const Input = ({
  value,
  type,
  name,
  error,
  touched,
  children,
  placeholder,
  onChange,
  onBlur,
  mask: pattern,
  ...props
}: Props | IInputProps) => {
  const handleChange = (event: any) => {
    if (!!pattern) {
      const unMaskedValue = unMask(event.target.value);
      const maskedValue = mask(unMaskedValue, pattern);
      return onChange(event.target.name)(maskedValue);
    }
    return onChange(event.target.name)(event.target.value);
  };
  return (
    <FormControl id={name} mt={4}>
      <InputGroup>
        <InputLeftAddon children={children} />
        <InPutBase
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          {...props}
        />
      </InputGroup>
      {touched && <FormHelperText color="red.500">{error}</FormHelperText>}
    </FormControl>
  );
};
