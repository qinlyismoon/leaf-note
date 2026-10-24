/**
 * Identification-label counting units (max 5).
 * - Each continuous Latin/number word = 1 unit
 * - Each CJK character = 1 unit
 * - Whitespace and standalone punctuation do not count
 */

const LATIN_WORD = /^[A-Za-z0-9]+/;
const CJK_CHAR =
  /^[\u3400-\u9FFF\uF900-\uFAFF\u3040-\u30FF\uAC00-\uD7AF]/;

export function countLabelUnits(value: string): number {
  const trimmed = value.trim();
  if (!trimmed) {
    return 0;
  }

  let units = 0;
  let i = 0;
  while (i < trimmed.length) {
    const rest = trimmed.slice(i);
    const word = rest.match(LATIN_WORD);
    if (word) {
      units += 1;
      i += word[0].length;
      continue;
    }
    const cjk = rest.match(CJK_CHAR);
    if (cjk) {
      units += 1;
      i += cjk[0].length;
      continue;
    }
    i += 1;
  }
  return units;
}

/** Keep a prefix that does not exceed `max` counting units. */
export function truncateLabelUnits(value: string, max: number): string {
  let out = '';
  let units = 0;
  let i = 0;

  while (i < value.length) {
    const rest = value.slice(i);
    const word = rest.match(LATIN_WORD);
    if (word) {
      if (units >= max) {
        break;
      }
      out += word[0];
      units += 1;
      i += word[0].length;
      continue;
    }
    const cjk = rest.match(CJK_CHAR);
    if (cjk) {
      if (units >= max) {
        break;
      }
      out += cjk[0];
      units += 1;
      i += cjk[0].length;
      continue;
    }
    out += value[i];
    i += 1;
  }

  return out;
}
