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
      // -   or after a space or a tab
      // - are at the end of a line
      // -   or are followed by a space or a tab
      // - are not inside an <img> tag
      // are valid

      const index = match.index;

      let startIsValid = index === 0;
      if (!startIsValid) {
        const letterBefore = str.charAt(index - 1);
        startIsValid = !!charPrefixes[letterBefore];
      }

      let endIsValid = index + match[0].length === str.length;
      if (!endIsValid) {
        // If not at the end of the string, check the characters after it
        const letterAfter = str.charAt(index + match[0].length);
        endIsValid = !!charPrefixes[letterAfter];
      }

      let outsideImageValid = true;
      let imgIdx = str.indexOf("<img", 0);
      while (outsideImageValid && imgIdx > -1) {
        const closingBracket = str.indexOf(">", imgIdx);
        if (closingBracket > -1) {
          if (index > imgIdx && index < closingBracket) {
            outsideImageValid = false;
          }
        }
        imgIdx = str.indexOf("<img", imgIdx + 1);
      }

      if (startIsValid && endIsValid && outsideImageValid) {
        ret.push({
          index: match.index,
          value: match[0].substring(1).trim()
        });
      }
    }
  } while (match);

  return ret;
}
