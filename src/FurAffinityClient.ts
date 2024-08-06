import { FurAffinityURL } from './FurAffinityURL';
import { FurAffinityScraper, type FurAffinityScraperOptions } from './scraper';
import { FurAffinitySubmission } from './submission';

export class FurAffinityClient {
  static readonly URL = FurAffinityURL;

  readonly scraper: FurAffinityScraper;
  readonly submission: FurAffinitySubmission;

  constructor(options: FurAffinityClientOptions) {
    this.scraper = new FurAffinityScraper(options);
    this.submission = new FurAffinitySubmission(this.scraper);
  }
}

export interface FurAffinityClientOptions extends FurAffinityScraperOptions {

}
