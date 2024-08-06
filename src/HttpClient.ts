export class hHttpClient {
  fetch = async (url: string, config: FetchConfig): Promise<FetchResult> => {
    const headers = new Headers();

    const reqOpts: RequestInit = {
      method: config?.method || 'GET',
      mode: 'no-cors',
      credentials: config?.cookies ? 'include' : undefined,
      headers,
    };

    if (config?.cookies) {
      headers.set('Cookie', config.cookies);
    }

    if (config?.body) {
      if (config.contentType === 'application/x-www-form-urlencoded') {
        const fd = new FormData();
        for (const k of Object.keys(config.body)) {
          const v = config.body[k];
          if (Array.isArray(v)) {
            // repeat key
            v.forEach(val => fd.append(k, String(val)));
          } else {
            fd.append(k, String(v));
          }
        }

        reqOpts.body = fd;
      } else {
        reqOpts.body = JSON.stringify(config.body);
      }
    }

    const res = await fetch(url, reqOpts);

    return {
      statusCode: res.status,
      body: await res.text(),
    };
  }
}

export interface FetchConfig {
  cookies?: string;
  method?: 'GET' | 'POST';
  body?: { [key: string]: string | number | (string | number)[] };
  contentType?: string;
}

export interface FetchResult {
  statusCode: number;
  body: string;
}
