import { Field } from "react-final-form";
import MuiTextField, {
  TextFieldProps as MuiTextFieldProps,
} from "@mui/material/TextField";

type TextFieldsProps = {
  name: string;
  caption?: string;
  validators?: [];
  validate?: (value: any) => undefined | string;
} & MuiTextFieldProps;

export const TextField: React.FC<TextFieldsProps> = ({
  name,
  caption,
  validate,
  required,
  ...restProps
}) => {
  return (
    <Field name={name} validate={validate}>
      {(props) => {
        return required ? (
          <MuiTextField required label={caption} {...props.input} {...restProps} />
        ) : (
          <MuiTextField label={caption} {...props.input} {...restProps}  />
        );
      }}
    </Field>
  );
};
