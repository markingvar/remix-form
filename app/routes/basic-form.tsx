import {
  formStructure,
  handleDataFn,
  successRedirectPath,
} from "~/forms/basic";
import { ActionFunction, LoaderFunction, useLoaderData } from "remix";
import { formActionFunction } from "~/services/form/action-function";
import { formLoaderFunction } from "~/services/form/loader-function";
import { BasicForm } from "~/services/form/form-types";

export const loader: LoaderFunction = async ({ request }) => {
  return formLoaderFunction({
    request,
    formStructure,
    formType: "basic",
  });
};

export const action: ActionFunction = async ({ request }) => {
  return formActionFunction({
    formType: "basic",
    request,
    formStructure,
    handleDataFn,
    successRedirectPath,
  });
};

export default function JimiHendrix() {
  let data = useLoaderData();

  const { context } = data;

  return <BasicForm formStructure={formStructure} context={context} />;
}
