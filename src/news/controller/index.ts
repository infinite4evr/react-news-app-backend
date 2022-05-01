import { Request, Response } from 'express';
import axios from 'axios';
import { newsApiUrl, newsApiKey } from '../../constants/index';

const PAGE_SIZE = 9;

type FilterData = {
  query: string;
  publishedFrom: string;
  publishedTill: string;
  sort: string;
  page: string;
};

/* interface NewsApiError {
  status: string;
  message: string;
}

function isNewsApiError(data: unknown): data is NewsApiError {
  if ((data as NewsApiError).message && (data as NewsApiError).status) {
    return true;
  }
  return false;
} */

const prepareQuery = (filterData: Partial<FilterData>): string => {
  let url =
    newsApiUrl +
    '/everything?language=en&' +
    `apiKey=${newsApiKey}` +
    `&pageSize=${PAGE_SIZE}`;

  const { query, publishedFrom, publishedTill, sort, page } = filterData;

  // we can make this one liner
  // could have used a function to prepare query string from object entries if keys were the same
  // I have used different keys so have not done it here
  if (publishedFrom) {
    url += `&from=${publishedFrom}`;
  }

  if (publishedTill) {
    url += `&to=${publishedTill}`;
  }

  if (query) {
    url += `&q=${query}`;
  }

  if (sort) {
    url += `&sortBy=${sort}`;
  }

  if (page) {
    url += `&page=${page}`;
  }

  return url;
};

class NewsController {
  async get(req: Request, res: Response) {
    try {
      // data is already validated
      const newsAPI = await axios.get(prepareQuery(req.query));
      res.json({ ...newsAPI.data });
    } catch (error) {
      // if using error logger, we can log it somewhere to debug later
      return res.status(500).json({
        status: false,
        msg: 'Server error, Please contact admin',
      });
    }
  }
}

export default new NewsController();
