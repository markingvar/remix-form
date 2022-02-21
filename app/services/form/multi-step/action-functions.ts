import { FormFieldInput, validateFieldValue } from "../form-field";
import { commitSession, getSession } from "../session.server";
import { json, redirect } from "remix";

// Take the form values from the request
// form data and add them to context
export async function addFormValuesToContext({
  formStructure,
  request,
  context,
}: {
  context: any;
  formStructure: FormFieldInput[];
  request: Request;
}) {
  // Get the inputs from the form
  const body = await request.formData();

  function addFieldToContext(field: FormFieldInput) {
    console.log({ field });

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

    // Add the field to context
    context[`${field.name}`] = {
      value: formFieldValue,
      errors,
    };

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
  formStructure.forEach((field) => {
    addFieldToContext(field);
  });
}

// Validate a form field value (context)
// using the validation patterns outlined in formField
// If an error exists, add it to the context
// errors array
export function validateFormFieldValue({
  formField,
  context,
}: {
  context: any;
  formField: FormFieldInput;
}) {
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

export async function formActionFunction({
  request,
  formStructure,
  handleDataFn,
  successRedirectPath,
}: {
  request: Request;
  formStructure: FormFieldInput[];
  handleDataFn: any;
  successRedirectPath: string;
}) {
  // Get the current session
  const session = await getSession(request.headers.get("Cookie"));

  let context: any = {};

  // Add the form values to context
  await addFormValuesToContext({ formStructure, request, context });

  // Validate the form inputs using the validation
  // methods from the form structure
  formStructure.forEach((formField) => {
    validateFormFieldValue({ context, formField });
  });

  // console.log({ context });

  session.set("context", context);

  // Check for errors in context
  function checkContextForErrors(context: any) {
    let errorsPresent = false;
    for (const fieldValue in context) {
      // @ts-expect-error Way of the road Bubbs
      if (fieldValue?.errors?.length >= 1) {
        errorsPresent = true;
      }

      if (errorsPresent) {
        return true;
      }
    }
    return false;
  }

  let errorsInContext = checkContextForErrors(context);

  // console.log({ errorsInContext });

  if (!errorsInContext) {
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

      return {
        formHandlerReturnFn: async () => {
          return redirect(successRedirectPath, {
            headers: {
              "Set-Cookie": await commitSession(session),
            },
          });
        },
      };
    } else {
      context.dataHandlerErrorMessage = message;
      session.set("context", context);
    }
  }
  return {
    formHandlerReturnFn: async () => {
      return json(
        {},
        {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        }
      );
    },
  };
}
