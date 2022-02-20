import { useState } from "react";

function createFieldLabel(fieldName: string) {
  let words = fieldName.split("-");

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1);
  }

  return words.join(" ");
}

export function validateFieldValue({
  value,
  regex,
}: {
  value: string;
  regex: string;
}) {
  let regexTestPattern = new RegExp(`${regex}`, "igm");

  return regexTestPattern.test(value);
}

function displayFieldErrors({
  fieldErrors,
  fieldVisited,
}: {
  fieldErrors: string[];
  fieldVisited: boolean;
}) {
  return (
    <div>
      {fieldErrors.length >= 1 && fieldVisited ? (
        fieldErrors.map((fieldError) => {
          return <div key={fieldError}>{fieldError}</div>;
        })
      ) : (
        <></>
      )}
    </div>
  );
}

type StatefulRadioField = {
  type: "stateful-radio";
  name: string;
  label: string;
  options: string[];
  initialValue: string;
  dependentChildren: [
    StatefulRadioField | RadioField | TextField | undefined
  ][];
};

type RadioField = {
  type: "radio";
  name: string;
  label: string;
  options: string[];
  initialValue: string;
};

type TextField = {
  type: "text" | "textarea";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

type PasswordField = {
  type: "password";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

type EmailField = {
  type: "email";
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  initialValue?: string;
  validation: {
    formInputPattern?: string;
    formInputMessage?: string;
    patterns: string[];
    messages: string[];
  };
};

export type FormFieldInput =
  | StatefulRadioField
  | RadioField
  | TextField
  | PasswordField
  | EmailField;

export function FormField({
  field,
  context,
}: {
  field: FormFieldInput;
  context: any;
}) {
  let errors: string[] = [];
  let visited = false;

  // console.log({ field });

  if (context[`${field.name}`]?.errors) {
    errors = context[`${field.name}`]?.errors;

    if (context[`${field.name}`]?.errors.length >= 1) visited = true;
  }

  let [fieldErrors, setFieldErrors] = useState(errors);
  let [fieldVisited, setFieldVisited] = useState(visited);

  // On change does validation checks when the input field changes
  function onChange(e: any) {
    // Is it a text field
    if (
      field.type === "text" ||
      field.type === "textarea" ||
      field.type === "password"
    ) {
      field.validation.patterns.map((pattern, index: number) => {
        let regexTestPattern = new RegExp(pattern, "gim");

        let fieldIsValid = regexTestPattern.test(e.target.value);

        if (fieldIsValid) {
          setFieldErrors([]);
        } else {
          // console.log("not valid");

          // Only display the error message once
          if (!fieldErrors.includes(field.validation.messages[index])) {
            setFieldErrors([...fieldErrors, field.validation.messages[index]]);
          }
        }
      });
    }
  }

  // console.log({ fieldErrors, fieldVisited });

  if (
    field.type === "text" &&
    (typeof context[`${field.name}`]?.value === "string" ||
      typeof context[`${field.name}`]?.value === "number")
  ) {
    return (
      <label className="block mb-6" key={field.name}>
        <span className="font-bold text-neutral-6">{field.label}</span>

        <span className="block h-1"></span>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <input
          className="bg-neutral-05 w-full text-base p-2"
          required={field.required}
          name={field.name}
          defaultValue={context[`${field.name}`].value}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation?.formInputPattern}
          title={field.validation?.formInputMessage}
          type={field.type}
        />
      </label>
    );
  }

  if (
    field.type === "password" &&
    typeof context[`${field.name}`]?.value === "string"
  ) {
    return (
      <label className="mb-6 block" key={field.name}>
        <span className="font-bold text-neutral-6">{field.label}</span>

        <span className="block h-1"></span>

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <input
          className="bg-neutral-05 w-full text-base p-2"
          required={field.required}
          name={field.name}
          defaultValue={context[`${field.name}`]?.value}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation?.formInputPattern}
          title={field.validation?.formInputMessage}
          type="password"
        />
      </label>
    );
  }

  if (
    field.type === "email" &&
    typeof context[`${field.name}`]?.value === "string"
  ) {
    return (
      <label className="mb-4" key={field.name}>
        {field.label}

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <input
          required={field.required}
          name={field.name}
          defaultValue={context[`${field.name}`]?.value}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
          pattern={field.validation?.formInputPattern}
          title={field.validation?.formInputMessage}
          type={field.type}
        />
      </label>
    );
  }

  if (
    field.type === "textarea" &&
    typeof context[`${field.name}`]?.value === "string"
  ) {
    return (
      <label className="mb-4" key={field.name}>
        {field.label}

        {displayFieldErrors({ fieldErrors, fieldVisited })}

        <textarea
          required={field.required}
          name={field.name}
          defaultValue={context[`${field.name}`]?.value}
          placeholder={field.placeholder}
          onBlur={() => setFieldVisited(true)}
          onChange={onChange}
        />
      </label>
    );
  }

  if (field.type === "radio") {
    return (
      <>
        <div className="font-bold text-neutral-6">{field.label}</div>
        <span className="block h-1"></span>
        {field.options?.map((radioValue, index) => {
          const label = createFieldLabel(radioValue);
          return (
            <div
              className="mb-1 flex items-center"
              key={`${field.name}-${radioValue}`}
            >
              <input
                key={radioValue}
                type="radio"
                id={`${field.name}-${radioValue}`}
                name={field.name}
                value={radioValue}
                autoComplete="off"
                defaultChecked={radioValue === context[`${field.name}`]?.value}
              />
              <label
                className="ml-2
              "
                htmlFor={`${field.name}-${radioValue}`}
              >
                {label}
              </label>
            </div>
          );
        })}
        <span className="block h-6"></span>
      </>
    );
  }

  if (field.type === "stateful-radio") {
    const { StatefulRadio, selectedValue } = useStatefulRadio({
      field,
      context,
    });

    return (
      <>
        <StatefulRadio key={field.name} />
        {selectedValue === 0 && field.dependentChildren[0].length >= 1
          ? field.dependentChildren[0].map((field) => {
              if (field) {
                return (
                  <FormField context={context} key={field.name} field={field} />
                );
              }
              return null;
            })
          : selectedValue === 1 && field.dependentChildren[1].length >= 1
          ? field.dependentChildren[1].map((field) => {
              if (field) {
                return (
                  <FormField context={context} key={field.name} field={field} />
                );
              }
              return null;
            })
          : selectedValue === 2 && field.dependentChildren[2].length >= 1
          ? field.dependentChildren[2].map((field) => {
              if (field) {
                return (
                  <FormField context={context} key={field.name} field={field} />
                );
              }

              return null;
            })
          : selectedValue === 3 && field.dependentChildren[3].length >= 1
          ? field.dependentChildren[3].map((field) => {
              if (field) {
                return (
                  <FormField context={context} key={field.name} field={field} />
                );
              }
              return null;
            })
          : []}
      </>
    );
  }
  return null;
}

function useStatefulRadio({
  field,
  context,
}: {
  field: StatefulRadioField;
  context: any;
}) {
  let selectedIndex = 0;
  field?.options?.forEach((option, index) => {
    if (context[`${field.name}`].value === option) {
      selectedIndex = index;
    }
  });

  const [selectedValue, setSelectedValue] = useState(selectedIndex);

  function StatefulRadio() {
    return (
      <>
        <div>{field.label}</div>
        {field.options?.map((radioValue, index) => {
          const label = createFieldLabel(radioValue);

          if (index === selectedValue) {
            return (
              <div key={radioValue}>
                <input
                  type="radio"
                  id={`${field.name}-${radioValue}`}
                  name={field.name}
                  value={radioValue}
                  onChange={() => {
                    setSelectedValue(index);
                  }}
                  checked={true}
                  autoComplete="off"
                />
                <label htmlFor={`${field.name}-${radioValue}`}>{label}</label>
              </div>
            );
          } else {
            return (
              <div key={radioValue}>
                <input
                  type="radio"
                  id={`${field.name}-${radioValue}`}
                  name={field.name}
                  value={radioValue}
                  onChange={() => {
                    setSelectedValue(index);
                  }}
                  autoComplete="off"
                />
                <label htmlFor={`${field.name}-${radioValue}`}>{label}</label>
              </div>
            );
          }
        })}
      </>
    );
  }
  return { StatefulRadio, selectedValue };
}