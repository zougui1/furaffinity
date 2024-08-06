export class FurAffinityError extends Error {
  code: number;
  url: string;
  details?: string;

  constructor({ message, code, url, details }: FurAffinityErrorOptions) {
    super(message);

    this.code = code;
    this.url = url;
    this.details = details;
  }

  static isError = (value: unknown): value is FurAffinityError => {
    return value instanceof FurAffinityError;
  }
}


export interface FurAffinityErrorOptions {
  message: string;
  code: number;
  url: string;
  details?: string;
}
