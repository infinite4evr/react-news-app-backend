import request from 'supertest';
import { newsApiUrl, PAGE_SIZE } from '../constants';
import { app } from '../main';

import nock from 'nock';
import { articlesResponse } from './fake-response';

describe('test news route', () => {
  const defaultQueryParams = {
    language: 'en',
    apiKey: 'some-default',
    pageSize: PAGE_SIZE,
    sortBy: 'popularity',
  };

  test('Should check for valid params', async () => {
    let res = await request(app).get('/api/news');

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty('param', 'query');

    res = await request(app).get('/api/news').query({
      query: 'test',
      publishedFrom: 'wrong-date',
      sort: 'popularity',
    });

    expect(res.status).toBe(400);

    expect(res.body).toHaveProperty('param', 'publishedFrom');
  });

  test('Should use params when they exist', async () => {
    const fakeApi = nock(newsApiUrl)
      .get('/everything')
      .query({
        q: 'test',
        from: '2002-04-12',
        ...defaultQueryParams,
      })
      .reply(200, articlesResponse);

    await request(app).get('/api/news').query({
      query: 'test',
      publishedFrom: '2002-04-12',
      sort: 'popularity',
    });

    // we are testing this to make sure that the api string contains the params provided by us
    // we are not testing the newsApi but testing the prepareQuery function ( our implementation )
    expect(fakeApi.isDone()).toBeTruthy();
  });

  // if api throws error in case
  test('Should handle exception', async () => {
    nock(newsApiUrl)
      .get('/everything')
      .query({ q: 'test', ...defaultQueryParams })
      .replyWithError('Error');

    const res = await request(app)
      .get('/api/news')
      .query({ query: 'test', sort: 'popularity' });

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('msg');
  });

  test('Should send response', async () => {
    nock(newsApiUrl)
      .get('/everything')
      .query({ q: 'test', ...defaultQueryParams })
      .reply(200, articlesResponse);

    const res = await request(app)
      .get('/api/news')
      .query({ query: 'test', sort: 'popularity' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('articles');
    expect(res.body.articles).toHaveLength(PAGE_SIZE);
  });
});
