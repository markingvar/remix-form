export type StatefulRadioField = {
  type: "stateful-radio";
  name: string;
  label: string;
  options: string[];
  initialValue: string;
  dependentChildren: [
    | StatefulRadioField
    | RadioField
    | TextField
    | EmailField
    | PasswordField
    | undefined
  ][];
};

type RadioField = {
  type: "radio";
  name: string;
  label: string;
  options: string[];
  initialValue: string;
};

type TextField = {
  type: "text" | "textarea";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

type PasswordField = {
  type: "password";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

type EmailField = {
  type: "email";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

export type FormFieldInput =
  | StatefulRadioField
  | RadioField
  | TextField
  | PasswordField
  | EmailField;

export type FormStructure = FormFieldInput[];
