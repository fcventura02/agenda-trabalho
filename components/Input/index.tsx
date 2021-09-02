/* eslint-disable react/no-children-prop */
import {
  FormControl,
  InputGroup,
  InputLeftAddon,
  Input as InPutBase,
  FormHelperText,
} from "@chakra-ui/react";

interface IInputProps {
  value: string;
  name: string;
  type: string;
  children: string;
  error?: string;
  placeholder: string;
  touched?: boolean;
  onChange: any;
  onBlur: any;
  disabled: boolean;
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
...props}: IInputProps) => (
  <FormControl id={name} mt={4}>
    <InputGroup>
      <InputLeftAddon children={children} />
      <InPutBase
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </InputGroup>
    {touched && <FormHelperText color="red.500">{error}</FormHelperText>}
  </FormControl>
);
