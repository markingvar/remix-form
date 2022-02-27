// Multi step form
import { validation } from "~/services/form/validation";
import { FormStructure } from "~/services/form/types";

type MultiStepForm = FormStructure[];

export const contactFormStructure: MultiStepForm = [
  [
    {
      name: "contact-name",
      label: "Full Name",
      type: "text",
      required: true,
      initialValue: "",
      validation: {
        formInputPattern: "[a-zA-Z&'\\s]{2,50}",
        formInputMessage: "letters, numbers, and '",
        patterns: ["[a-z&'\\s]{2,50}"],
        messages: ["Please use letters, spaces, or '"],
      },
    },
  ],
  [
    {
      name: "preferred-contact-method",
      label: "Preferred Contact Method",
      type: "stateful-radio",
      options: ["phone", "email"],
      initialValue: "phone",
      dependentChildren: [
        [
          {
            name: "phone-number",
            label: "Phone Number",
            type: "text",
            initialValue: "",
            required: true,
            validation: {
              formInputPattern: validation.phoneNumber.pattern,
              formInputMessage: validation.phoneNumber.message,
              patterns: [validation.phoneNumber.pattern],
              messages: [validation.phoneNumber.message],
            },
          },
        ],
        [
          {
            name: "email-address",
            label: "Email Address",
            type: "email",
            initialValue: "",
            required: true,
            validation: {
              formInputPattern: validation.emailAddress.pattern,
              formInputMessage: validation.emailAddress.message,
              patterns: [validation.emailAddress.pattern],
              messages: [validation.emailAddress.message],
            },
          },
        ],
      ],
    },
  ],
  [
    {
      name: "desired-service",
      label: "What Service Can We Provide?",
      type: "radio",
      options: [
        "residential-design",
        "home-renovation",
        "3d-renders",
        "custom-kitchen",
        "e-design",
        "home-staging",
      ],
      initialValue: "residential-design",
    },
    {
      name: "project-details",
      label: "Tell Us a Little About Your Project",
      type: "textarea",
      initialValue: "",
      required: true,
      validation: {
        formInputPattern: "[a-zA-Z&!.,'\\d\\s]{2,300}",
        formInputMessage: "letters, numbers, and basic punctuation",
        patterns: ["[a-z&!.,'\\d\\s]{2,300}"],
        messages: ["Please use letters, numbers and basic punctuation"],
      },
    },
  ],
];

export async function handleDataFn(context: any): Promise<[boolean, string]> {
  console.log("multipart form handleDataFn called!");

  console.log({ context });

  // Sort through the context to get the structure that
  // we want

  const lambdaUrl =
    "https://moflill1wg.execute-api.ca-central-1.amazonaws.com/prod/";

  const preferredContactMethod = createFieldLabel(
    context["preferred-contact-method"].value
  );

  let data: {
    contactName: string;
    preferredContactMethod: string;
    contactEmail?: string;
    contactPhone?: string;
    desiredService: string;
    projectDetails: string;
  } = {
    contactName: context["contact-name"].value,
    preferredContactMethod,
    desiredService: createFieldLabel(context[`desired-service`].value),
    projectDetails: context["project-details"].value,
  };

  if (preferredContactMethod === "Email") {
    data.contactEmail = context["email-address"].value;
  }

  if (preferredContactMethod === "Phone") {
    data.contactPhone = context["phone-number"].value;
  }

  console.log({ data });

  let clientRequest = await fetch(lambdaUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const clientRequestData = await clientRequest.json();

  console.log({ clientRequestData });

  let success = clientRequestData?.success;

  if (success) {
    return [true, "We got you message! We'll get back to you soon!"];
  } else {
    return [false, "There was an error submitting the form. Please try again."];
  }
}

export const successRedirectPath = "/form-submit-success";

function createFieldLabel(fieldName: string) {
  let words = fieldName.split("-");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}
