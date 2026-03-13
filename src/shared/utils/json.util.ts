export function parseRawTextToJson<T>(rawJsonText: string): T {
  try {
    const jsonString = rawJsonText
      .replace(/^```json\n/, "")
      .replace(/\n```$/, "")
      .trim();

    return JSON.parse(jsonString) as T;
  } catch (error) {
    throw new Error("Error extracting JSON from text", {
      cause: error
    });
  }
}
