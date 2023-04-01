import { decipher, encipher, generateCipherAlphabetFromKey } from "./index";

describe("Simple Substitution Cipher", () => {
  it("should encode a string", () => {
    const key = "aardvark";
    expect(encipher("hello", key)).toBe("nbpph");
    expect(encipher("peanut", key)).toBe("xbwilo");
    console.log(
      encipher(
        "Some years later, Matrix is informed by his former superior, General Franklin Kirby, that members of his unit were killed by mercenaries hired by a ruthless warlord. Matrix shrugs this off but he is soon attacked by the same group of mercenaries. During the assault, his daughter is kidnapped. He then goes off on his own to find his daughter and destroy the men who tried to kill him. He gets into a car wreck and is captured by the gang.",
        key
      )
    );
  });

  it("should decode a string", () => {
    const key = "aardvark";
    expect(decipher("nbpph", key)).toBe("hello");
  });

  it("encode then decode should result in the same value", () => {
    const key = "aardvark";
    expect(decipher(encipher("hello", key), key)).toBe("hello");
  });

  it("should be able to deterministally generate a cipher alphabet from a key", () => {
    const key = "hello world";
    const alphabet1 = generateCipherAlphabetFromKey(key);
    const alphabet2 = generateCipherAlphabetFromKey(key);
    expect(alphabet1).toBe("swezhqguiaxnopdvrkfbcjmylt");
    expect(alphabet1).toBe(alphabet2);
  });
});
