import { FurAffinityClient as FA } from 'fa.js';
import { isNumber } from 'radash';

import {
  convertSearchPageResult,
  getSearchParams,
  type SearchPage,
  type SearchOptions,
  type SearchPageOptions,
} from './search';
import { convertSubmissionResult, type Submission } from './submission';
import { FurAffinityError } from './FurAffinityError';
import { FuraffinityURL } from './FuraffinityURL';

export class FuraffinityClient {
  readonly #fa: FA;
  static readonly URL = FuraffinityURL;

  constructor(options: FuraffinityClientOptions) {
    this.#fa = new FA({
      ...options,
      cookies: [`b=${options.cookieB}`, `a=${options.cookieA}`, 's=1'].join(';'),
      disableRetry: true,
      throwErrors: true,
    });
  }

  findSubmission = async (id: number): Promise<Submission | undefined> => {
    try {
      const submission = await this.#fa.getSubmission(id);
      return convertSubmissionResult(submission);
    } catch (error) {
      if (FurAffinityError.isError(error) && error.status === 404) {
        return;
      }

      throw error;
    }
  }

  extractSubmissionId = (url: string): number => {
    if (!FuraffinityURL.checkIsValidHostName(url)) {
      throw new Error(`Invalid URL hostname: ${url}`);
    }

    const urlObj = new URL(url);

    const [viewStr, idStr] = urlObj.pathname.split('/').filter(Boolean);

    if (viewStr !== 'view') {
      throw new Error(`Invalid URL pathname: ${url}`);
    }

    const id = Number(idStr);

    if (!isNumber(id)) {
      throw new Error(`Invalid URL ID: ${url}`);
    }

    return id;
  }

  async * search(query: string, options?: SearchOptions) {
    let pageNum = options?.startPage ?? 0;

    while (true) {
      pageNum++;
      const page = await this.getSearchPage(query, {
        ...options,
        page: pageNum,
      });

      if (!page.more) {
        return page.submissions;
      }

      yield page.submissions;
    }
  }


  getSearchPage = async (query = '', options?: SearchPageOptions): Promise<SearchPage> => {
    await this.checkLogin()
    const searchPage = await this.#fa.getSearchPage(
      query,
      getSearchParams(options),
      options?.page,
    );

    return convertSearchPageResult(searchPage);
  }

  private async checkLogin(): Promise<void> {
    const data = await this.#fa.getMessages();

    if (!data.my_username) {
      throw new Error('Could not log you in');
    }
  }
}

export interface FuraffinityClientOptions {
  cookieA: string;
  cookieB: string;
}
