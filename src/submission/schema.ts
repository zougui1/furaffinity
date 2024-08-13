import { z } from 'zod';

export const internalSubmissionSchema = z.object({
  id: z.number().min(1).int(),
  url: z.string().url().min(1),
  type: z.enum(['image', 'story', 'music', 'flash', 'unknown']),
  rating: z.enum(['General', 'Mature', 'Adult']),
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
  const publicSubmission: Submission = {
    id: submission.id,
    url: submission.url,
    type: submission.type,
    rating: submission.rating,
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

  return publicSubmission;
});

export const submissionSchema = z.object({
  id: z.number().min(1).int(),
  url: z.string().url().min(1),
  type: z.enum(['image', 'story', 'music', 'flash', 'unknown']),
  rating: z.enum(['General', 'Mature', 'Adult']),
  title: z.string().min(1),
  thumbnailUrl: z.string().url().min(1),
  contentUrl: z.string().url().min(1),
  author: z.object({
    name: z.string().min(1),
    url: z.string().url().min(1),
    avatar: z.string().url().min(1),
  }),
  descriptionText: z.string(),
  descriptionHtml: z.string(),
  keywords: z.array(z.string().min(1)),
  postedAt: z.date(),
});

export interface InternalSubmission extends z.input<typeof internalSubmissionSchema> {

}

export interface Submission extends z.infer<typeof submissionSchema> {

}
