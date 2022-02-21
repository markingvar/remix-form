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
            type: "text",
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
