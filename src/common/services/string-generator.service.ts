import * as crypto from "crypto";

export class GenerateString {
  public static generateStringByRandomBytes(lenght: number): string {
    return crypto.randomBytes(lenght).toString("hex");
  }
}