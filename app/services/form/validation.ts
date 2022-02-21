export const validationPatterns = {
  alphanumeric: "^[A-Za-z0-9'&\\s]{3,50}$",
  alphanumericSentence: "^[A-Za-z0-9'&\\s]{8,100}$",
  phoneNumber: "^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$",
  email: "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
  postalCode: "^(?!.*[DFIOQU])[A-VXY][0-9][A-Z]\\s?[0-9][A-Z][0-9]$",
};

export const validation = {
  phoneNumber: {
    pattern: "^\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})$",
    message: "Please provide a valid phone number",
  },
  emailAddress: {
    pattern:
      "^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$",
    message: "Please provide a valid email address",
  },
};
