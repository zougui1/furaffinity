import type { SearchPage as FASearchPage } from 'fa.js';

import type { SearchPage } from './types';
import { fixSelfLink } from '../utils';

export const convertSearchPageResult = (searchPage: FASearchPage): SearchPage => {
  return {
    more: searchPage.more,
    submissions: searchPage.submissions.map(submission => {
      return {
        id: submission.id,
        url: fixSelfLink(submission.self_link),
        thumbnailUrl: submission.thumb_url,
        title: submission.title,
        authorName: submission.artist_name,
        postedAt: submission.when,
      };
    }),
  };
}
