export class FurAffinityError extends Error {
  status: number;
  url: string;

  constructor(message: string, status: number, url: string) {
    super(message);

    this.status = status;
    this.url = url;
  }

  static isError = (value: unknown): value is FurAffinityError => {
    return (
      value instanceof Error &&
      'status' in value &&
      typeof value.status === 'number' &&
      'url' in value &&
      typeof value.url === 'string'
    );
  }
}
