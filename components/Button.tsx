import MuiButton, { ButtonProps } from "@mui/material/Button";


export const Button: React.FC<ButtonProps> = ({
    className,
    children,
    variant = "contained",
    ...props
  }) => {
    return (
      <MuiButton className={`mt-4 ${className}`} variant={variant} {...props}>
        {children}
      </MuiButton>
    );
  };