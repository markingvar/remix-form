import { FormFieldInput } from "../form-field";
import { getSession, commitSession } from "~/services/form/session.server";
import { json } from "remix";
import { addFieldToContext, checkForFieldNameAndValue } from "../loader-utils";

export async function formLoaderFunction({
  request,
  formStructure,
}: {
  request: Request;
  formStructure: FormFieldInput[][];
}) {
  // Get current session
  const session = await getSession(request.headers.get("Cookie"));

  let context = session.get("context");

  // Check to see if the current context matches the current
  // form structure
  // If it does not match, we want to reset it
  context = checkExistingContext({ formStructure, context });

  console.log({ context });
  // If the context object doesn't have any length, we
  // know that it is empty and we need to seed it
  if (Object.keys(context).length < 1) {
    context = seedContextWithInitialValues({ formStructure });
  }

  // Get the current step
  let currentStep = context?.currentStep;

  // If there is no current step, set it to 0
  if (!currentStep) {
    context.currentStep = 0;
  }

  session.set("context", context);

  return json(
    { context, formStructure: formStructure[context.currentStep] },
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
  formStructure: FormFieldInput[][];
  context: any;
}) {
  // Check to see if the context applies to the current form
  let incorrectContext = false;

  for (const stepStructure of formStructure) {
    for (const field of stepStructure) {
      if (incorrectContext) {
        return {};
      }

      incorrectContext = checkForFieldNameAndValue({ field, context });
    }
  }
  return context;
}

function seedContextWithInitialValues({
  formStructure,
}: {
  formStructure: FormFieldInput[][];
}) {
  // Give the context object initial values
  let context: any = {};

  for (const stepStructure of formStructure) {
    for (const field of stepStructure) {
      addFieldToContext({ field, context });
    }
  }

  context.currentStep = 0;

  return context;
}
