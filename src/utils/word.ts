const IRREGULAR_PLURALS = new Map([
  ['child', 'children'],
  ['person', 'people'],
  ['man', 'men'],
  ['woman', 'women'],
  ['tooth', 'teeth'],
  ['foot', 'feet'],
  ['mouse', 'mice'],
  ['goose', 'geese'],
]);

const IRREGULAR_SINGULARS = new Map(
  Array.from(IRREGULAR_PLURALS.entries()).map(([singular, plural]) => [
    plural,
    singular,
  ])
);

export function capitalize(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function plural(word: string): string {
  if (!word || isPlural(word)) return word;

  if (IRREGULAR_PLURALS.has(word.toLowerCase())) {
    return IRREGULAR_PLURALS.get(word.toLowerCase())!;
  }

  if (
    word.match(/[sxz]$/) ||
    word.match(/[^aeiou]h$/) ||
    word.match(/[^aeiou]o$/)
  ) {
    return word + 'es';
  }
  if (word.match(/[^aeiou]y$/)) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.match(/f$/) || word.match(/fe$/)) {
    return word.replace(/f[e]?$/, 'ves');
  }
  if (word.match(/[^aeiou]us$/)) {
    return word.slice(0, -2) + 'i';
  }
  if (word.match(/is$/)) {
    return word.slice(0, -2) + 'es';
  }
  if (word.match(/on$/)) {
    return word.slice(0, -2) + 'a';
  }

  return word + 's';
}

export function singular(word: string): string {
  if (!word || isSingular(word)) return word;

  if (IRREGULAR_SINGULARS.has(word.toLowerCase())) {
    return IRREGULAR_SINGULARS.get(word.toLowerCase())!;
  }

  if (word.match(/ies$/)) {
    return word.slice(0, -3) + 'y';
  }
  if (word.match(/ves$/)) {
    return word.slice(0, -3) + 'f';
  }
  if (word.match(/i$/)) {
    return word.slice(0, -1) + 'us';
  }
  if (word.match(/a$/)) {
    return word.slice(0, -1) + 'on';
  }
  if (word.match(/es$/)) {
    if (word.match(/[sxz]es$/) || word.match(/[^aeiou]hes$/)) {
      return word.slice(0, -2);
    }
    return word.slice(0, -1);
  }
  if (word.match(/s$/)) {
    return word.slice(0, -1);
  }

  return word;
}

function isPlural(word: string): boolean {
  if (IRREGULAR_PLURALS.has(word.toLowerCase())) return false;
  if (IRREGULAR_SINGULARS.has(word.toLowerCase())) return true;

  return (
    word.match(/[^aeiou]s$/) !== null ||
    word.match(/es$/) !== null ||
    word.match(/i$/) !== null ||
    word.match(/a$/) !== null
  );
}

function isSingular(word: string): boolean {
  return !isPlural(word);
}
