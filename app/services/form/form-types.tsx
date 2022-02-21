import { FormFieldInput } from "./types";
import { Form } from "remix";
import { FormField } from "./form-field";

export function MultipartForm({
  context,
  formStructure,
}: {
  context: any;
  formStructure: FormFieldInput[];
}) {
  return (
    <div>
      <Form method="post">
        {formStructure.map((field: FormFieldInput) => {
          if (field) {
            return (
              <FormField field={field} context={context} key={field.name} />
            );
          }
        })}
        {(context.formStage === "beginning" ||
          context.formStage === "middle") && (
          <button name="submit-type" type="submit" value="next">
            Next
          </button>
        )}
        {context.formStage === "end" && (
          <button name="submit-type" type="submit" value="submit">
            Submit
          </button>
        )}
      </Form>
      {(context.formStage === "middle" || context.formStage === "end") && (
        <Form method="post">
          <button name="submit-type" type="submit" value="back">
            Back
          </button>
        </Form>
      )}
    </div>
  );
}

export function BasicForm({
  context,
  formStructure,
}: {
  context: any;
  formStructure: FormFieldInput[];
}) {
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
