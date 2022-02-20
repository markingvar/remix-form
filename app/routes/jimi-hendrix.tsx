import { formStructure, onFormCompleted } from "~/components/form";
import {
  ActionFunction,
  Form,
  LoaderFunction,
  redirect,
  useLoaderData,
} from "remix";
import { FormField, validateFieldValue } from "~/components/form/form-field";
import type { FormFieldInput } from "~/components/form/form-field";
import {
  addFormValuesToContext,
  handleFormAction,
  validateFormFieldValue,
} from "~/components/form/action-functions";
import { getSession } from "~/components/form/session.server";
import { formLoaderFunction } from "~/components/form/loader-functions";

export const loader: LoaderFunction = async ({ request }) => {
  return formLoaderFunction({ request, formStructure });
};

export const action: ActionFunction = async ({ request }) => {
  let handleFormFnResult = await handleFormAction({
    request,
    formStructure,
    handleDataFn: (ctx: any) => {
      console.log("handleDataFn called!");

      console.log({ ctx });
    },
    successRedirectPath: "/jimi-hendrix",
  });

  let { formHandlerReturnFn } = handleFormFnResult;

  return formHandlerReturnFn();
};

export default function JimiHendrix() {
  let data = useLoaderData();

  const { formStructure, context } = data;
  return (
    <Form method="post">
      {formStructure.map((field: FormFieldInput) => {
        return <FormField field={field} context={context} key={field.name} />;
      })}
      <button type="submit">Submit</button>
    </Form>
  );
}
