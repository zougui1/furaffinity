export interface Submission {
  id: number;
  url: string;
  type: 'image' | 'flash' | 'story' | 'music';
  title: string;
  thumbnailUrl: string;
  contentUrl: string;
  author: {
    name: string;
    url: string;
    avatar: string;
  };
  descriptionText: string;
  descriptionHtml: string;
  keywords: string[];
  postedAt: Date;
}
