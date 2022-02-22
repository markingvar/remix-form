import { FormFieldInput } from "~/services/form/types";
import { getSession, commitSession } from "~/services/form/session.server";
import { json } from "remix";
import { addFieldToContext, checkForFieldNameAndValue } from "./loader-utils";
import { getFormStage } from "./shared";

async function formLoaderFunction({
  formType,
  request,
  formStructure,
}: {
  formType: "multipart";
  request: Request;
  formStructure: FormFieldInput[][];
}): Promise<any>;
async function formLoaderFunction({
  formType,
  request,
  formStructure,
}: {
  formType: "basic";
  request: Request;
  formStructure: FormFieldInput[];
}): Promise<any>;
async function formLoaderFunction({
  formType,
  request,
  formStructure,
}: {
  formType: "multipart" | "basic";
  request: Request;
  formStructure: FormFieldInput[][] | FormFieldInput[];
}): Promise<any> {
  // Get current session
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  // Check to see if the current context matches the current
  // form structure
  // If it does not match, we want to reset it
  // @ts-expect-error overloads not externally visible
  context = checkExistingContext({ formStructure, formType, context });

  // console.log({ context });
  // If the context object doesn't have any length, we
  // know that it is empty and we need to seed it
  if (Object.keys(context).length < 1) {
    // @ts-expect-error overload not externally visible
    context = seedContextWithInitialValues({ formStructure, formType });
  }

  // Get the current step
  let currentStep = context?.currentStep;

  // If there is no current step, set it to 0
  if (!currentStep && formType === "multipart") {
    context.currentStep = 0;
  }

  if (formType === "multipart") {
    // @ts-expect-error function overload signature issue
    let formStage = getFormStage({ context, formStructure });

    context.formStage = formStage;
  }

  session.set("context", context);

  if (formType === "multipart") {
    return json(
      { context, formStructure: formStructure[context.currentStep] },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  } else {
    return json(
      { context, formStructure },
      {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      }
    );
  }
}

// Check to see if the context applies to the current form

function checkExistingContext({
  formType,
  formStructure,
  context,
}:
  | {
      formType: "basic";
      formStructure: FormFieldInput[];
      context: any;
    }
  | {
      formType: "multipart";
      formStructure: FormFieldInput[][];
      context: any;
    }): any {
  // If context does not exist, return early. We will need to
  // seed the context with initial values
  if (!context) {
    return false;
  }

  let incorrectContext = false;

  if (formType === "multipart") {
    for (const stepStructure of formStructure) {
      // @ts-expect-error way she goes
      for (const field of stepStructure) {
        if (incorrectContext) {
          return {};
        }

        incorrectContext = checkForFieldNameAndValue({ field, context });
      }
    }
  }

  if (formType === "basic") {
    for (const field of formStructure) {
      if (incorrectContext) {
        return {};
      }

      // @ts-expect-error function overload issue
      incorrectContext = checkForFieldNameAndValue({ field, context });
    }
  }

  return context;
}

function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "multipart";
  formStructure: FormFieldInput[][];
}): any;
function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "basic";
  formStructure: FormFieldInput[];
}): any;
function seedContextWithInitialValues({
  formType,
  formStructure,
}: {
  formType: "multipart" | "basic";
  formStructure: FormFieldInput[][] | FormFieldInput[];
}): any {
  // Give the context object initial values
  let context: any = {};

  if (formType === "multipart") {
    for (const stepStructure of formStructure) {
      for (const field of stepStructure) {
        if (field) {
          addFieldToContext({ field, context });
        }
      }
    }

    context.currentStep = 0;
  }

  if (formType === "basic") {
    for (const field of formStructure) {
      if (field) {
        // @ts-expect-error function overload issue
        addFieldToContext({ field, context });
      }
    }
  }

  return context;
}

export { formLoaderFunction };
