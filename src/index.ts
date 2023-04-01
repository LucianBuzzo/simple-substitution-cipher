import { MersenneTwister19937, createEntropy } from "random-js";
import { readFileSync } from "fs";

const loadQuadgramData = (filename: string) => {
  const fileContent = readFileSync(filename, "utf-8");
  const lines = fileContent.split("\n");
  const quadgramMap: Record<string, number> = {};

  for (const line of lines) {
    const [quadgram, frequency] = line.split(" ");
    quadgramMap[quadgram.toLowerCase()] = parseInt(frequency, 10);
  }

  return quadgramMap;
};

const QUADGRAMS_FILE = "./english_quadgrams.txt";
const QUADGRAMS = loadQuadgramData(QUADGRAMS_FILE);

const quadgramScore = (text: string) => {
  let score = 0;
  const cleanedText = text.replace(/[^a-z]/g, "").toLowerCase();

  for (let i = 0; i < cleanedText.length - 3; i++) {
    const quadgram = cleanedText.slice(i, i + 4);
    const quadgramFrequency = QUADGRAMS[quadgram] || 0;
    score += Math.log(quadgramFrequency + 1);
  }

  return score;
};

export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";


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

export const processText = (
  text: string,
  sourceAlphabet: string,
  targetAlphabet: string
) => {
  const lookupTable = createLookupTable(sourceAlphabet, targetAlphabet);

  return text
    .toLowerCase()
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

const frequencyAnalysis = (text: string) => {
  const processedText = text.toLowerCase().replace(/[^a-z]/g, '')
  const charFrequency: Record<string, number> = {}
  for (let char of processedText) {
    if (charFrequency[char]) {
      charFrequency[char]++
    } else {
      charFrequency[char] = 1
    }
  }
  const totalChars = processedText.length
  for (let char in charFrequency) {
    charFrequency[char] = charFrequency[char] / totalChars
  }
  return charFrequency
}

export const crack = (cipherText: string) => {
  // Remove non-alphabetic characters and convert to lowercase
  const cleanedCipherText = cipherText.toLowerCase().replace(/[^a-z]/g, "");

  // Function to swap two characters in a string at positions i and j
  const swapPositions = (str: string, i: number, j: number) => {
    const chars = str.split("");
    [chars[i], chars[j]] = [chars[j], chars[i]];
    return chars.join("");
  };

  // Function to get a random integer between min and max (inclusive)
  const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  // Set the maximum number of iterations for the hill-climbing algorithm
  const MAX_ITERATIONS = 10000;

  // Generate a random initial alphabet as the starting point
  let bestAlphabet = ALPHABET.split("").sort(() => Math.random() - 0.5).join("");

  // Decrypt the text using the initial alphabet and calculate its quadgram score
  let bestText = processText(cleanedCipherText, ALPHABET, bestAlphabet);
  let bestScore = quadgramScore(bestText);

  // Iterate through the hill-climbing algorithm
  for (let iteration = 0; iteration < MAX_ITERATIONS; iteration++) {
    // Get two random positions in the alphabet
    const i = getRandomInt(0, 25);
    const j = getRandomInt(0, 25);

    // Swap characters at the random positions in the current best alphabet
    const newAlphabet = swapPositions(bestAlphabet, i, j);

    // Decrypt the text using the new alphabet and calculate its quadgram score
    const newText = processText(cleanedCipherText, ALPHABET, newAlphabet);
    const newScore = quadgramScore(newText);

    // If the new quadgram score is better, update the best alphabet, text, and score
    if (newScore > bestScore) {
      bestAlphabet = newAlphabet;
      bestText = newText;
      bestScore = newScore;
    }
  }

  // Decipher the original cipher text using the best alphabet found
  return processText(cipherText, ALPHABET, bestAlphabet)
};
