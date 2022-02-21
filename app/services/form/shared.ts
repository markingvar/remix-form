import { FormFieldInput } from "~/services/form/types";

function getFormStage({
  context,
  formStructure,
}: {
  context: any;
  formStructure: FormFieldInput[][];
}): "beginning" | "middle" | "end" {
  // What stage of the form are we in
  // Beginning - Middle - End
  const numberOfAvailableSteps = formStructure.length;
  let formStage: "beginning" | "middle" | "end" =
    context.currentStep === 0
      ? "beginning"
      : context.currentStep + 1 === numberOfAvailableSteps
      ? "end"
      : "middle";

  return formStage;
}

export { getFormStage };
