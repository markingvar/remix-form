import type { FormFieldInput } from "./form-field";

type FormStructure = FormFieldInput[];

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
                  // formInputPattern: "/[d]+/",
                  // formInputMessage: "Only numbers allowed",
                  // patterns: ["/[d]+"],
                  // messages: ["Only numbers allowed"],
                  patterns: ["[a-zA-Z&!\\d\\s]{2,50}"],
                  messages: ["Letters, numbers, and spaces allowed"],
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

// Context - desired initial values
// Get the initial context from the form structure
export const context = {
  "likes-jh": {
    value: "no",
    errors: [],
  },
  "fav-jh-song": {
    value: "no",
    errors: [],
  },
  "fav-song": {
    value: "",
    errors: [],
  },
  "likes-rhcp": {
    value: "no",
    errors: [],
  },
};

// What to do on successful form completion?
export function onFormCompleted({
  context,
}: {
  context: {
    "likes-jh": {
      value: "yes" | "no";
      errors: string[];
    };
    "fav-jh-song": {
      value: "yes" | "no";
      errors: string[];
    };
    "fav-song": {
      value: string | undefined;
      errors: string[];
    };
  };
}) {
  // Doesn't like JH
  if (context["likes-jh"].value === "no") {
    // Handle scenario
    console.log("You don't like Jimi Hendrix");
    return true;
  }

  // Likes JH
  if (context["likes-jh"].value === "yes") {
    // No fav song
    if (context["fav-jh-song"].value === "no") {
      // Handle scenario
      console.log("You like Jimi Hendrix but don't have a favorite song");
      return true;
    }
    // Has fav song
    else {
      // Handle scenario
      console.log(
        `You like Jimi Hendrix. Your favorite song by him is ${context["fav-song"].value}`
      );
      return true;
    }
  }
  return false;
}
