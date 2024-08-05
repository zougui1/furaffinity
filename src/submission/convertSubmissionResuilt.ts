import type { Submission as FASubmission } from 'fa.js';

import type { Submission } from './types';
import { fixSelfLink } from '../utils';

export const convertSubmissionResult = (submission: FASubmission): Submission => {
  return {
    id: submission.id,
    url: fixSelfLink(submission.self_link),
    type: submission.type,
    title: submission.title,
    thumbnailUrl: submission.thumb_url,
    contentUrl: submission.content_url,
    author: {
      name: submission.artist_name,
      url: fixSelfLink(submission.artist_url),
      avatar: submission.artist_thumb_url,
    },
    descriptionText: submission.body_text,
    descriptionHtml: submission.body_html,
    keywords: Array.isArray(submission.keywords)
      ? submission.keywords
      : submission.keywords.split(/ +/g),
    postedAt: submission.when,
  };
}
