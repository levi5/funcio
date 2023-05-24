export class ExtractValueError extends Error {
  constructor(message: string) {
    super(message);
    this.message = `Extract Value Error: ${message}`;
  }
}