export interface Token {
  index: number;
  value: string;
}

// Find all words beginning with "/"
const regex = /(?<!\w)\/\w+/g;

const charPrefixes = {
  "\n": true,
  "\t": true,
  " ": true
};

export default function parseTokens(str: string): Array<Token> {
  const ret = [];

  let match: RegExpExecArray;
  do {
    match = regex.exec(str);
    if (match) {
      // This is probably doable in regex, but screw it...
      // Filter it out so that only tokens that are
      // - at the start of a line
      // - after a space or a tab
      // are valid

      const index = match.index;

      let endIsValid = index + match[0].length === str.length;
      if (!endIsValid) {
        // If not at the end of the string, check the characters after it
        const letterAfter = str.charAt(index + match[0].length);
        console.log("letterAfter is ", letterAfter, " for ", match[0]);
        endIsValid = !!charPrefixes[letterAfter];
      }

      console.log("got endIsValid ", endIsValid, " for ", match[0]);

      let startIsValid = index === 0;
      if (!startIsValid) {
        const letterBefore = str.charAt(index - 1);
        startIsValid = !!charPrefixes[letterBefore];
      }

      console.log("got startIsValid ", startIsValid, " for ", match[0]);

      if (startIsValid && endIsValid) {
        ret.push({
          index: match.index,
          value: match[0].substring(1).trim()
        });
      }
    }
  } while (match);

  console.log("parseTokens", ret);

  return ret;
}
