import { formStructure, handleFormData } from "~/forms/jimi-hendrix";
import { ActionFunction, Form, LoaderFunction, useLoaderData } from "remix";
import { FormField } from "~/services/form/form-field";
import type { FormFieldInput } from "~/services/form/types";
import { formActionFunction } from "~/services/form/action-function";
import { formLoaderFunction } from "~/services/form/loader-function";

export const loader: LoaderFunction = async ({ request }) => {
  return await formLoaderFunction({
    request,
    formStructure,
    formType: "basic",
  });
};

export const action: ActionFunction = async ({ request }) => {
  return await formActionFunction({
    formType: "basic",
    request,
    formStructure,
    handleDataFn: handleFormData,
    successRedirectPath: "/jimi-hendrix",
  });
};

export default function JimiHendrix() {
  let data = useLoaderData();

  const { formStructure, context } = data;
  return (
    <Form method="post">
      {formStructure.map((field: FormFieldInput) => {
        if (field) {
          return <FormField field={field} context={context} key={field.name} />;
        }
      })}
      <button type="submit">Submit</button>
    </Form>
  );
}
