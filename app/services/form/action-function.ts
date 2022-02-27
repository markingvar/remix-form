import {
  checkContextForErrors,
  handleFormData,
  honeypotFieldHasValue,
} from "./action-utils";
import { FormFieldInput } from "./types";
import { commitSession, getSession } from "~/services/form/session.server";
import { json, redirect } from "remix";
import {
  addFormValuesToContext,
  validateFormFieldValue,
} from "~/services/form/action-utils";
import { getFormStage } from "./shared";

async function formActionFunction({
  formType,
  request,
  formStructure,
  handleDataFn,
  successRedirectPath,
}:
  | {
      formType: "basic";
      request: Request;
      formStructure: FormFieldInput[];
      handleDataFn: any;
      successRedirectPath: string;
    }
  | {
      formType: "multipart";
      request: Request;
      formStructure: FormFieldInput[][];
      handleDataFn: any;
      successRedirectPath: string;
    }): Promise<any> {
  // Get the current session
  const session = await getSession(request.headers.get("Cookie"));

  let context: any = session.get("context") ?? {};

  const body = await request.formData();

  let honeypotFieldHit = honeypotFieldHasValue({ body });

  if (honeypotFieldHit) {
    return redirect("/");
  }

  let submitType: "back" | "next" | "submit" | string =
    body.get("submit-type")?.toString() ?? "";

  // console.log({ submitType });

  // Multipart - back button
  if (formType === "multipart") {
    if (submitType === "back") {
      context.currentStep -= 1;
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

  // Add the form values to context
  // @ts-expect-error Overload not externally visible
  await addFormValuesToContext({ formType, formStructure, body, context });

  // Validate the form inputs using the validation
  // methods from the form structure
  if (formType === "basic") {
    formStructure.forEach((formField) => {
      // @ts-expect-error function overload issue
      validateFormFieldValue({ context, formField });
    });
  }

  if (formType === "multipart") {
    const currentFormStep = context.currentStep;

    // @ts-ignore
    for (const formField of formStructure[currentFormStep]) {
      console.log({ formField });

      validateFormFieldValue({ context, formField });
    }
  }

  session.set("context", context);

  // Check for errors in context
  // In basic, we want to check all of the context entries
  // In multipart, we only want to check the context items
  // for the current step
  // @ts-expect-error function overload not externally visible
  let errorsInContext = checkContextForErrors({
    context,
    formType,
    formStructure,
  });

  console.log({ errorsInContext, context });

  if (!errorsInContext) {
    // If there are no errors in the context we have two routes
    // to take

    // Basic Form
    // Multipart Form

    // BASIC FORM
    if (formType === "basic") {
      return handleFormData({
        handleDataFn,
        commitSession,
        context,
        successRedirectPath,
        session,
      });
    }

    // MULTIPART FORM

    // Get the current form stage
    // This will determine a couple things
    // * What buttons we need to render on the form
    // (Next, Back, Submit)
    // * If we are at the end, we want to handle the data,
    // otherwise we want to show the next step of the form
    // @ts-expect-error function overload issue
    const formStage = getFormStage({ formStructure, context });
    context.formStage = formStage;

    // Handle data
    if (formStage === "end" && submitType === "submit") {
      return handleFormData({
        handleDataFn,
        commitSession,
        context,
        successRedirectPath,
        session,
      });
    } else {
      // Still at the beginning or middle of the form
      // All the inputs were correct, we want to go to
      // the next stage of the form
      context.currentStep += 1;
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

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export { formActionFunction };
