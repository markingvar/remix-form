import { FormFieldInput } from "./form-field";
import { getSession, commitSession } from "~/components/form/session.server";
import { json } from "remix";

export async function formLoaderFunction({
  request,
  formStructure,
}: {
  request: Request;
  formStructure: FormFieldInput[];
}) {
  // Get current session
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  checkExistingContext({ formStructure, context });

  if (!context) {
    context = seedContextWithInitialValues({ formStructure });
  }

  session.set("context", context);

  return json(
    { context, formStructure },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

function checkExistingContext({
  formStructure,
  context,
}: {
  formStructure: FormFieldInput[];
  context: any;
}) {
  let incorrectContext = false;
  function checkForNameAndValue(field: FormFieldInput) {
    if (context[`${field.name}`]) {
      if (!context[`${field.name}`]?.value) {
        incorrectContext = true;
      }
    } else {
      incorrectContext = true;
    }

    if (incorrectContext) {
      context = {};
      return;
    }

    if (field.type === "stateful-radio") {
      if (field.type === "stateful-radio") {
        field.dependentChildren.forEach((fields) => {
          fields.forEach((field) => {
            console.log({ loaderField: field });

            if (typeof field !== "undefined") {
              checkForNameAndValue(field);
            }
          });
        });
      }
    }
    formStructure.forEach((field) => {
      checkForNameAndValue(field);
    });
  }
}

function seedContextWithInitialValues({
  formStructure,
}: {
  formStructure: FormFieldInput[];
}) {
  let context: any = {};

  function addFieldToContext(field: FormFieldInput) {
    context[`${field.name}`] = {
      value: field.initialValue || "",
      errors: [],
    };

    if (field.type === "stateful-radio") {
      field.dependentChildren.forEach((fields) => {
        fields.forEach((field) => {
          console.log({ loaderField: field });

          if (typeof field !== "undefined") {
            addFieldToContext(field);
          }
        });
      });
    }
  }

  formStructure.forEach((field) => {
    addFieldToContext(field);
  });

  return context;
}
