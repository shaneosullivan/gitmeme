export interface Token {
  index: number;
  value: string;
}

// Find all words beginning with "/"
const regex = /(?<!\w)\/\w+/g;

export default function parseTokens(str: string): Array<Token> {
  const ret = [];

  let match: RegExpExecArray;
  do {
    match = regex.exec(str);
    if (match) {
      ret.push({
        index: match.index,
        value: match[0].substring(1).trim()
      });
    }
  } while (match);

  return ret;
}
