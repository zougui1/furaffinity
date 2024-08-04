const hostNames = [
  'furaffinity.net',
  'xfuraffinity.net',
  'fxfuraffinity.net',
  'vxfuraffinity.net',
].reduce((acc, host) => [...acc, host, `www.${host}`], [] as string[]);

export class FuraffinityURL {
  static readonly hostNames: Readonly<string[]> = hostNames;

  static checkIsValidHostName = (value: string): boolean => {
    try {
      const url = new URL(value);
      return this.hostNames.includes(url.hostname);
    } catch {
      return false;
    }
  }

  static normalizeHostName = (value: string, hostName: string): string => {
    const url = new URL(value);
    url.hostname = hostName;

    return url.toString();
  }
}
