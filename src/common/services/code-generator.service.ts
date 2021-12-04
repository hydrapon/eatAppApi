export class GenerateCode {
  public static generateCodeSixNums(): string {
    return `${Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000}`;
  }
}