import { redirect, json } from "remix";
import { FormFieldInput } from "./types";

// A bot entered a value into a hidden field
function honeypotFieldHasValue({ body }: { body: FormData }) {
  let honeypotField = body.get("username");

  if (honeypotField) {
    return true;
  }

  return false;
}

// Take the form values from the request
// form data and add them to context
function addFormValuesToContext({
  formType,
  formStructure,
  body,
  context,
}:
  | {
      formType: "multipart";
      context: any;
      formStructure: FormFieldInput[][];
      body: FormData;
    }
  | {
      formType: "basic";
      context: any;
      formStructure: FormFieldInput[];
      body: FormData;
    }): any {
  // Get the inputs from the form
  function addFieldToContext(field: FormFieldInput) {
    // Get the form field value
    let formFieldValue =
      body.get(`${field.name}`)?.toString() ?? field.initialValue;

    let errors: string[] = [];
    // If a field is required and not present, we need to add an error
    // to the field
    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "email" ||
      field.type === "password"
    ) {
      if (!formFieldValue && field.required) {
        errors.push("This field is required");
      }
    }

    if (typeof field === "object") {
      // Add the field to context
      context[`${field.name}`] = {
        value: formFieldValue,
        errors,
      };
    }

    // If it is a stateful radio field, check for
    // dependent children
    if (field.type === "stateful-radio") {
      // Get the index of the selected value
      // We need this to know which children to show

      field.dependentChildren.forEach((fields) => {
        if (typeof fields !== "undefined") {
          fields.forEach((nestedField) => {
            if (nestedField) {
              addFieldToContext(nestedField);
            }
          });
        }
      });
    }
  }

  // Use the form structure to create a context object
  if (formType === "basic") {
    formStructure.forEach((field) => {
      // @ts-expect-error overload selection error
      addFieldToContext(field);
    });
  }

  if (formType === "multipart") {
    // Get the current form step to know what to add to context
    const currentFormStep = context.currentStep;

    console.log("lol: ", typeof formStructure[currentFormStep]);

    // @ts-ignore
    for (const field of formStructure[currentFormStep]) {
      if (field) {
        addFieldToContext(field);
      }
    }
  }
}

function validateFieldValue({
  value,
  regex,
}: {
  value: string;
  regex: string;
}) {
  let regexTestPattern = new RegExp(`${regex}`, "igm");

  return regexTestPattern.test(value);
}

// Validate a form field value (context)
// using the validation patterns outlined in formField
// If an error exists, add it to the context
// errors array
function validateFormFieldValue({
  formField,
  context,
}: {
  context: any;
  formField: FormFieldInput;
}) {
  // currentStep and formStage are context properties
  // that we don't want to validate, they are also not
  // objects
  console.log(typeof formField);

  // if (typeof formField !== "object") {
  //   console.log("I'm out..");

  //   return;
  // }
  const currentFieldValue = context[`${formField.name}`].value;

  if (
    formField.type === "text" ||
    formField.type === "textarea" ||
    formField.type === "email" ||
    formField.type === "password"
  ) {
    // Iterate through the validation patterns
    formField.validation.patterns.forEach((pattern, index) => {
      const valueIsValid = validateFieldValue({
        value: currentFieldValue,
        regex: pattern,
      });

      console.log("valueIsValid: ", valueIsValid);

      // Value is not valid
      // Push current error message onto array if it isn't already there
      if (
        !valueIsValid &&
        !context[`${formField.name}`].errors.includes(
          formField.validation.messages[index]
        )
      ) {
        // console.log("add an error");

        context[`${formField.name}`].errors.push(
          formField.validation.messages[index]
        );
      }
    });
  }

  if (formField.type === "stateful-radio") {
    let { dependentChildren } = formField;
    // Get currently selected radio option
    // Get the index of the current value
    const selectedValueIndex: number =
      formField.options.indexOf(currentFieldValue);

    if (typeof dependentChildren === "object") {
      dependentChildren[selectedValueIndex].forEach((dependentField) => {
        if (typeof dependentField !== "undefined") {
          validateFormFieldValue({ context, formField: dependentField });
        }
      });
    }
  }
}

// Check for errors in context
// In basic, we want to check all of the context entries
// In multipart, we only want to check the context items
// for the current step
function checkContextForErrors({
  context,
  formType,
  formStructure,
}:
  | {
      formStructure: FormFieldInput[];
      formType: "basic";
      context: any;
    }
  | {
      formStructure: FormFieldInput[][];
      formType: "multipart";
      context: any;
    }): boolean {
  let errorsPresent = false;
  // Basic form
  if (formType === "basic") {
    for (const fieldValue of context) {
      if (fieldValue?.errors?.length >= 1) {
        errorsPresent = true;
      }

      if (errorsPresent) {
        return true;
      }
    }
  }

  if (formType === "multipart") {
    const currentFormStep = context.currentStep;

    // Using the current form step, get the context fields to
    // check for errors
    // eslint-disable-next-line no-inner-declarations
    function addFieldNameToValidateToArray(
      field: FormFieldInput,
      fieldsToValidate: string[]
    ) {
      fieldsToValidate.push(field.name);

      if (field.type === "stateful-radio") {
        let selectedIndex = field.options.indexOf(
          context[`${field.name}`].value
        );
        field.dependentChildren[selectedIndex].forEach((nestedField) => {
          if (nestedField) {
            fieldsToValidate.push(nestedField.name);
          }
        });
      }
    }
    // We only care about the context values in the current step
    let fieldsToValidate: string[] = [];

    for (const field of formStructure[currentFormStep]) {
      console.log({ field });

      if (context) addFieldNameToValidateToArray(field, fieldsToValidate);
    }

    console.log({ fieldsToValidate });

    for (const fieldToValidate of fieldsToValidate) {
      if (context[`${fieldToValidate}`]?.errors?.length >= 1) {
        errorsPresent = true;
      }

      if (errorsPresent) {
        return true;
      }
    }
  }
  return false;
}

// Takes in the data (context), success redirect path, and
// session and commitSession function
async function handleFormData({
  handleDataFn,
  context,
  successRedirectPath,
  session,
  commitSession,
}: {
  handleDataFn: any;
  context: any;
  successRedirectPath: string;
  session: any;
  commitSession: any;
}) {
  // Handle Data - the data function returns a tuple

  // the first item is a boolean to indicate
  // whether the operation succeeded or failed

  // The second item in the tuple is the success or error message

  let handleDataResult: [boolean, string] = await handleDataFn(context);
  let [success, message] = handleDataResult;

  if (success) {
    context.dataHandlerSuccessMessage = message;
    context.dataHandlerErrorMessage = "";
    session.set("context", context);

    return redirect(successRedirectPath, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    context.dataHandlerSuccessMessage = "";
    context.dataHandlerErrorMessage = message;
    session.set("context", context);

    return json(
      {},
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}

export {
  honeypotFieldHasValue,
  addFormValuesToContext,
  validateFormFieldValue,
  validateFieldValue,
  checkContextForErrors,
  handleFormData,
};
