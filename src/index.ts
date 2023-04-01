import { MersenneTwister19937, createEntropy } from "random-js";

const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

const stringTo32BitInteger = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);
    hash = (hash << 5) - hash + charCode;
    hash |= 0; // Convert to a 32-bit integer
  }
  return hash;
};

export const generateCipherAlphabetFromKey = (
  key: string,
  alphabet = "abcdefghijklmnopqrstuvwxyz"
) => {
  const seed = stringTo32BitInteger(key);
  const twister = MersenneTwister19937.seed(seed);
  const alphabetArray = alphabet.split("");
  const cipherAlphabet: string[] = [];
  while (cipherAlphabet.length < alphabetArray.length) {
    const int = Math.abs(twister.next());
    const index = int % alphabet.length;
    const char = alphabetArray[index];
    if (!cipherAlphabet.includes(char)) {
      cipherAlphabet.push(char);
    }
  }
  return cipherAlphabet.join("");
};

const createLookupTable = (sourceAlphabet: string, targetAlphabet: string) => {
  return sourceAlphabet
    .split("")
    .reduce<Record<string, string>>((lookupTable, sourceChar, i) => {
      const targetChar = targetAlphabet[i];
      lookupTable[sourceChar] = targetChar;
      return lookupTable;
    }, {});
};

const processText = (
  text: string,
  sourceAlphabet: string,
  targetAlphabet: string
) => {
  const lookupTable = createLookupTable(sourceAlphabet, targetAlphabet);

  return text
    .split("")
    .map((char) => lookupTable[char])
    .join("");
};

export const encipher = (text: string, key: string) => {
  const cipherAlphabet = generateCipherAlphabetFromKey(key);
  return processText(text, ALPHABET, cipherAlphabet);
};

export const decipher = (ciphertext: string, key: string) => {
  const cipherAlphabet = generateCipherAlphabetFromKey(key);
  return processText(ciphertext, cipherAlphabet, ALPHABET);
};
