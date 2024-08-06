import { FurAffinityError } from '../../FurAffinityError';
import { FetchResult } from '../../HttpClient';

export const checkErrors = (res: FetchResult, url: string): void => {
  if (res.statusCode !== 200) {
    throw new FurAffinityError({
      message: 'An error occured while fetching furaffinity\'s web page.',
      code: res.statusCode,
      url,
    });
  }

  if (res.body.includes('You are allowed to views the statistics of your own account alone.')) {
    throw new FurAffinityError({
      message: 'You are allowed to views the statistics of your own account alone.',
      code: 401,
      url,
    });
  }

  if (res.body.includes('you must log in')) {
    throw new FurAffinityError({
      message: 'You must log in.',
      code: 403,
      url,
    });
  }

  if (res.body.includes('This user has voluntarily disabled access to their userpage.')) {
    throw new FurAffinityError({
      message: 'This user has voluntarily disabled access to their userpage.',
      code: 403,
      url,
    });
  }

  if (res.body.includes('The submission you are trying to find is not in our database.')) {
    throw new FurAffinityError({
      message: 'The submission you are trying to find is not in furaffinity\'s database.',
      code: 404,
      url,
    });
  }

  if (res.body.includes('The journal you are trying to find is not in our database.')) {
    throw new FurAffinityError({
      message: 'The journal you are trying to find is not in furaffinity\'s database.',
      code: 404,
      url,
    });
  }

  if (res.body.includes('This user cannot be found.')) {
    throw new FurAffinityError({
      message: 'This user cannot be found.',
      code: 404,
      url,
    });
  }

  if (res.body.includes('was not found in our database')) {
    throw new FurAffinityError({
      message: 'Data not found in furaffinity\'s database',
      code: 404,
      url,
    });
  }

  if (res.body.includes('For more information please check the')) {
    throw new FurAffinityError({
      message: 'Furaffinity internal server error',
      code: 500,
      url,
    });
  }

  if (res.body.includes('The server is currently having difficulty responding to all requests.')) {
    throw new FurAffinityError({
      message: 'Furaffinity\'s server is currently having difficulty responding to all requests.',
      code: 503,
      url,
    });
  }
}
