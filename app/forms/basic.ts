// Single Step Form
import { FormStructure } from "~/services/form/types";

export const formStructure: FormStructure = [
  {
    name: "likes-jh",
    label: "Do You Like Jimi Hendrix?",
    type: "stateful-radio",
    options: ["yes", "no"],
    initialValue: "no",
    dependentChildren: [
      [
        {
          name: "fav-jh-song",
          label: "Do You Have A Favorite Jimi Hendrix Song?",
          type: "stateful-radio",
          options: ["yes", "no"],
          initialValue: "no",
          dependentChildren: [
            [
              {
                name: "fav-song",
                label: "Favorite Song?",
                type: "text",
                required: true,
                initialValue: "",
                validation: {
                  formInputPattern: "[a-zA-Z&!\\d\\s]{2,50}",
                  formInputMessage: "letters, numbers, and spaces",
                  patterns: ["[a-zA-Z&!\\d\\s]{2,50}"],
                  messages: ["Please use letters, numbers, and spaces"],
                },
              },
            ],
            [undefined],
          ],
        },
      ],
      [undefined],
    ],
  },
  {
    name: "likes-rhcp",
    label: "Do You Like The Red Hot Chili Peppers?",
    type: "radio",
    options: ["yes", "no"],
    initialValue: "no",
  },
];

export function handleDataFn(context: any) {
  console.log("basic form handleDataFn called!");

  console.log({ context });
}

export const successRedirectPath = "/";
