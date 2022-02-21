import { FormFieldInput } from "~/services/form/types";

function checkForFieldNameAndValue({
  field,

  context,
}: {
  field: FormFieldInput;

  context: any;
}) {
  let contextFieldName = context[`${field.name}`];

  // console.log({ contextFieldName });

  if (contextFieldName) {
    if (typeof contextFieldName?.value !== "string") {
      console.log("bad value: ", contextFieldName.value);

      return true;
    }
  } else {
    return true;
  }

  if (field.type === "stateful-radio") {
    field.dependentChildren.forEach((fields) => {
      fields.forEach((field) => {
        if (field) {
          checkForFieldNameAndValue({ field, context });
        }
      });
    });
  }

  return false;
}

function addFieldToContext({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  context[`${field.name}`] = {
    value: field.initialValue || "",
    errors: [],
  };

  console.log("adding field context: ", context);

  if (field.type === "stateful-radio") {
    field.dependentChildren.forEach((fields) => {
      fields.forEach((field) => {
        if (typeof field !== "undefined") {
          addFieldToContext({ field, context });
        }
      });
    });
  }
}

export { addFieldToContext, checkForFieldNameAndValue };
