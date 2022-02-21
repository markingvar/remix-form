import {
  contactFormStructure,
  successRedirectPath,
  handleDataFn,
} from "~/forms/multipart";
import { ActionFunction, LoaderFunction, useLoaderData } from "remix";

import { formActionFunction } from "~/services/form/action-function";
import { formLoaderFunction } from "~/services/form/loader-function";
import { MultipartForm } from "~/services/form/form-types";

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
    handleDataFn,
    successRedirectPath,
  });
};

export default function ContactUsForm() {
  let data = useLoaderData();

  let { formStructure, context } = data;

  return <MultipartForm context={context} formStructure={formStructure} />;
}
