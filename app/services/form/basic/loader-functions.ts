import { FormFieldInput } from "../form-field";
import { getSession, commitSession } from "~/services/form/session.server";
import { json } from "remix";
import { addFieldToContext, checkForFieldNameAndValue } from "../loader-utils";

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

  context = checkExistingContext({ formStructure, context });

  console.log({ context });

  if (Object.keys(context).length < 1) {
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

  for (const field of formStructure) {
    if (incorrectContext) {
      return {};
    }

    incorrectContext = checkForFieldNameAndValue({ field, context });
  }

  return context;
}

function seedContextWithInitialValues({
  formStructure,
}: {
  formStructure: FormFieldInput[];
}) {
  let context: any = {};

  formStructure.forEach((field) => {
    addFieldToContext({ field, context });
  });

  return context;
}
