import React from "react";

interface FormValidatorProps {
  fields: { [key: string]: string }; // Objeto com os campos a serem validados
  children: (validate: () => boolean) => React.ReactNode;
}

const FormValidator: React.FC<FormValidatorProps> = ({ fields, children }) => {
  const validate = (): boolean => {
    for (const key in fields) {
      if (fields[key].trim() === "") {
        return false;
      }
    }
    return true;
  };

  return <>{children(validate)}</>;
};

export default FormValidator;
