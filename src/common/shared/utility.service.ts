import { Injectable } from "@nestjs/common";
@Injectable()
export class UtilityService {
  parseRawTextToJson<T>(rawJsonText: string): T {
    try {
      const jsonString = rawJsonText
        .replace(/^```json\n/, "")
        .replace(/\n```$/, "")
        .trim();
      const jsonObject = JSON.parse(jsonString) as T;
      return jsonObject;
    } catch (error) {
      throw new Error("Error extracting JSON from the response text.", {
        cause: error
      });
    }
  }
}
