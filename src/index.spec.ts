import { crack, decipher, encipher, generateCipherAlphabetFromKey } from "./index";

// Sample text from https://en.wikipedia.org/wiki/The_Matrix
const SAMPLE_TEXT = `
The Matrix is a 1999 science fiction action film written and directed by The Wachowskis, starring Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving, and Joe Pantoliano. It depicts a dystopian future in which reality as perceived by most humans is actually a simulated reality called "the Matrix", created by sentient machines to subdue the human population, while their bodies' heat and electrical activity are used as an energy source. Computer programmer Neo learns this truth and is drawn into a rebellion against the machines, which involves other people who have been freed from the "dream world".
The Matrix is an example of the cyberpunk subgenre of science fiction.[8] The Wachowskis' approach to action scenes was influenced by Japanese animation[9] and martial arts films, and the film's use of fight choreographers and wire fu techniques from Hong Kong action cinema influenced subsequent Hollywood action film productions. The film popularized a visual effect known as "bullet time", in which the heightened perception of certain characters is represented by allowing the action within a shot to progress in slow-motion while the camera appears to move through the scene at normal speed, allowing the sped-up movements of certain characters to be perceived normally.
The Matrix opened in theaters in the United States on March 31, 1999, to widespread acclaim from critics, who praised its innovative visual effects, action sequences, cinematography and entertainment value,[10][11] and was a massive success at the box office, grossing over $460 million on a $63 million budget, becoming the highest-grossing Warner Bros. film of 1999 and the fourth highest-grossing film of that year. At the 72nd Academy Awards, the film won all four categories it was nominated for, Best Visual Effects, Best Film Editing, Best Sound, and Best Sound Editing. The film was also the recipient of numerous other accolades, including Best Sound and Best Special Visual Effects at the 53rd British Academy Film Awards, and the Wachowskis were awarded Best Director and Best Science Fiction Film at the 26th Saturn Awards. The film is considered to be among the greatest science fiction films of all time,[12][13][14] and in 2012, the film was selected for preservation in the United States National Film Registry by the Library of Congress for being "culturally, historically, and aesthetically significant."[15]
The film's success led to two feature film sequels being released in 2003, The Matrix Reloaded and The Matrix Revolutions, which were also written and directed by the Wachowskis. The Matrix franchise was further expanded through the production of comic books, video games and an animated anthology film, The Animatrix, with which the Wachowskis were heavily involved. The franchise has also inspired books and theories expanding on some of the religious and philosophical ideas alluded to in the films. A fourth film, titled The Matrix Resurrections, was released on December 22, 2021.
`

describe("Simple Substitution Cipher", () => {
  it("should encode a string", () => {
    const key = "aardvark";
    expect(encipher("hello", key)).toBe("nbpph");
    expect(encipher("peanut", key)).toBe("xbwilo");
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

  it("should work with long strings of text", () => {
    const key = "aardvark";
    const cipherText = encipher(SAMPLE_TEXT, key);
    expect(decipher(cipherText, key)).toBe(
      SAMPLE_TEXT.toLowerCase().replace(/[^a-z]/g, '')
    )
  });

  it("should crack a cipher", () => {
    const key = "aardvark";
    const cipherText = encipher(SAMPLE_TEXT, key);
    const processedText = SAMPLE_TEXT.toLowerCase().replace(/[^a-z]/g, '')
    const cracked = crack(cipherText);
    console.log(cracked)
    expect(cracked.length).toBe(processedText.length)
    expect(cracked).toBe(
      processedText
    )
  });
});
