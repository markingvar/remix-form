import { redirect } from "remix";
import { FormFieldInput } from "./types";

// Take the form values from the request
// form data and add them to context
async function addFormValuesToContext({
  formType,
  formStructure,
  body,
  context,
}: {
  formType: "basic";
  context: any;
  formStructure: FormFieldInput[];
  body: FormData;
}): Promise<any>;
async function addFormValuesToContext({
  formType,
  formStructure,
  body,
  context,
}: {
  formType: "multipart";
  context: any;
  formStructure: FormFieldInput[][];
  body: FormData;
}): Promise<any>;
async function addFormValuesToContext({
  formType,
  formStructure,
  body,
  context,
}: {
  formType: "basic" | "multipart";
  context: any;
  formStructure: FormFieldInput[] | FormFieldInput[][];
  body: FormData;
}): Promise<any> {
  // Get the inputs from the form
  function addFieldToContext(field: FormFieldInput) {
    // Get the form field value
    let formFieldValue =
      body.get(`${field.name}`)?.toString() || field.initialValue;

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

    if (field) {
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
          fields.forEach((field) => {
            if (field) {
              addFieldToContext(field);
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

    console.log({ currentFormStep });

    console.log(formStructure[currentFormStep]);

    // @ts-expect-error overload selection error
    for (const field of formStructure[currentFormStep]) {
      console.log({ field });

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
  // that we don't want to validate
  if (typeof formField !== "object") {
    return;
  }

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

    if (dependentChildren) {
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
}: {
  formStructure: FormFieldInput[];
  formType: "basic";
  context: any;
}): boolean;
function checkContextForErrors({
  context,
  formType,
  formStructure,
}: {
  formStructure: FormFieldInput[][];
  formType: "multipart";
  context: any;
}): boolean;
function checkContextForErrors({
  context,
  formType,
  formStructure,
}: {
  formStructure: FormFieldInput[] | FormFieldInput[][];
  formType: "basic" | "multipart";
  context: any;
}): boolean {
  let errorsPresent = false;
  // Basic form
  if (formType === "basic") {
    for (const fieldValue in context) {
      // @ts-expect-error Way of the road Bubbs
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
    function addFieldNameToValidateToArray(
      field: FormFieldInput,
      fieldsToValidate: string[]
    ) {
      fieldsToValidate.push(field.name);

      if (field.type === "stateful-radio") {
        field.dependentChildren.forEach((fields) => {
          fields.forEach((field) => {
            if (field) {
              fieldsToValidate.push(field.name);
            }
          });
        });
      }
    }
    // We only care about the context values in the current step
    const fieldsToValidate: string[] = [];
    for (const field in formStructure[currentFormStep]) {
      // @ts-expect-error
      addFieldNameToValidateToArray(field, fieldsToValidate);
    }

    for (const fieldToValidate in fieldsToValidate) {
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
  // handle data - the data function should return a tuple
  // the first item in the tuple will be a boolean to indicate
  // whether the operation succeeded or failed

  // The second item in the tuple is the success or error message
  let handleDataResult = handleDataFn(context);
  // let [success, message] = handleDataResult;
  let success = true,
    message = "Roped him with a bungie cord";

  if (success) {
    context.dataHandlerSuccessMessage = message;
    session.set("context", context);

    return redirect(successRedirectPath, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } else {
    context.dataHandlerErrorMessage = message;
    session.set("context", context);
  }
}

export {
  addFormValuesToContext,
  validateFormFieldValue,
  validateFieldValue,
  checkContextForErrors,
  handleFormData,
};
