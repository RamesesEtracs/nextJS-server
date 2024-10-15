import {
  Form as FinalForm,
  FormProps as FinalFormProps,
  FormRenderProps,
} from "react-final-form";



type FormProps = {
  children: (props: FormRenderProps) => React.ReactNode;
} & FinalFormProps;

export const Form: React.FC<FormProps> = ({
  initialValues,
  onSubmit,
  children,
}) => {
  return (
    <FinalForm
      initialValues={initialValues || {}}
      onSubmit={onSubmit}
      render={(formRenderProps: FormRenderProps) => {
        return (
          <form onSubmit={formRenderProps.handleSubmit}>
            {children(formRenderProps)}
          </form>
        );
      }}
    ></FinalForm>
  );
};
