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
      let isValid = index === 0;
      if (!isValid) {
        const letterBefore = str.charAt(index - 1);
        isValid = !!charPrefixes[letterBefore];
      }

      if (isValid) {
        ret.push({
          index: match.index,
          value: match[0].substring(1).trim()
        });
      }
    }
  } while (match);

  return ret;
}
