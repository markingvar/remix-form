import { contactFormStructure } from "~/forms/contact-us";
import { ActionFunction, LoaderFunction, Form, useLoaderData } from "remix";
import { FormField } from "~/services/form/form-field";
import { FormFieldInput } from "~/services/form/types";

import { formActionFunction } from "~/services/form/action-function";
import { formLoaderFunction } from "~/services/form/loader-function";
import { MultipartForm } from "~/services/form/multi-part";

export const loader: LoaderFunction = async ({ request }) => {
  return await formLoaderFunction({
    formType: "multipart",
    formStructure: contactFormStructure,
    request,
  });
};

export const action: ActionFunction = async ({ request }) => {
  return await formActionFunction({
    formStructure: contactFormStructure,
    formType: "multipart",
    request,
    handleDataFn: () => {
      console.log("Contact us data handler called!!");
    },
    successRedirectPath: "/",
  });
};

export default function ContactUsForm() {
  let data = useLoaderData();

  let { formStructure, context } = data;

  return <MultipartForm context={context} formStructure={formStructure} />;
}
