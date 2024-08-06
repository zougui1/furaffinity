import { z } from 'zod';

export const internalSubmissionSchema = z.object({
  id: z.number().min(1).int(),
  url: z.string().url().min(1),
  type: z.enum(['image', 'story', 'music', 'flash', 'unknown']),
  title: z.string().min(1),
  thumbnailUrl: z.string().url().min(1),
  contentUrl: z.string().url().min(1),
  authorName: z.string().min(1),
  authorUrl: z.string().url().min(1),
  authorAvatar: z.string().url().min(1),
  descriptionText: z.string(),
  descriptionHtml: z.string(),
  keywords: z.array(z.string().min(1)),
  postedAt: z.date(),
}).transform(submission => {
  return {
    id: submission.id,
    url: submission.url,
    type: submission.type,
    title: submission.title,
    thumbnailUrl: submission.thumbnailUrl,
    contentUrl: submission.contentUrl,
    author: {
      name: submission.authorName,
      url: submission.authorUrl,
      avatar: submission.authorAvatar,
    },
    descriptionText: submission.descriptionText,
    descriptionHtml: submission.descriptionHtml,
    keywords: submission.keywords,
    postedAt: submission.postedAt,
  };
});

export interface InternalSubmission extends z.input<typeof internalSubmissionSchema> {

}

export interface Submission extends z.output<typeof internalSubmissionSchema> {

}
