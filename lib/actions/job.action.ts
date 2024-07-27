import { GetQuestionsParams } from './shared.types';
import { JobI } from '@/types';

export const getJobFilter = async () => {
  const url = 'https://restcountries.com/v3.1/all';

  try {
    const response = await fetch(url);
    const data = await response.json();
    const countriesFilter = data.map((item: any) => ({
      name: item.name.common,
      value: item.name.common.toLowerCase(),
    }));

    const flags = data.reduce((acc: any, item: any) => {
      acc[item.cca2] = item.flag;
      return acc;
    }, {});

    return { countriesFilter, flags };
  } catch (error) {}
};

export const getJobDetailsList = async (
  params: GetQuestionsParams
): Promise<{ results: JobI[] } | undefined> => {
  const { page, filter, searchQuery } = params;
  const searchQueryParse = searchQuery?.split(' ').join('%20');
  const url = `https://jsearch.p.rapidapi.com/search?query=${searchQueryParse || 'developers'}&in%20${filter || 'usa'}&page=${page}`;
  try {
    const response = await fetch(`${url}`, {
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_API_KEY || '',
        'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      },
    });
    const { data } = await response.json();

    return { results: data };
  } catch (error) {
    console.log(error);
  }
};
