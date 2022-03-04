export function convertSingleQuotes(string: string) {
  let stringLength = string.length;
  let result = "";

  for (let i = 0; i < stringLength; i++) {
    // look for single quotes
    let stringChar = string.charCodeAt(i);

    // console.log({ stringChar });

    if (stringChar === 8216 || stringChar === 8217) {
      // console.log("We've got a runner");

      result += "'";
    } else {
      result += string[i];
    }
  }

  // console.log({ result });

  return result;
}
