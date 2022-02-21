import { contactFormStructure } from "~/forms/contact-us";
import { ActionFunction, LoaderFunction, Form, useLoaderData } from "remix";
import { FormField, FormFieldInput } from "~/services/form/form-field";

import { formActionFunction } from "~/services/form/multi-step/action-functions";
import { formLoaderFunction } from "~/services/form/loader-function";

export const loader: LoaderFunction = async ({ request }) => {
  return await formLoaderFunction({
    formType: "multipart",
    formStructure: contactFormStructure,
    request,
  });
};

export default function ContactUsForm() {
  let data = useLoaderData();

  let { formStructure, context } = data;

  console.log({ data });

  return (
    <Form method="post">
      {formStructure.map((field: FormFieldInput) => {
        if (field) {
          return <FormField field={field} context={context} key={field.name} />;
        }
      })}
      {context.currentStep > 0 && (
        <button name="submit-type" type="submit" value="back">
          Back
        </button>
      )}
      {context.currentStep < 2 && (
        <button name="submit-type" type="submit" value="next">
          Next
        </button>
      )}
    </Form>
  );
}
