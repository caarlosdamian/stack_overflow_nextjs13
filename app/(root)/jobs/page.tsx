import { JobCard } from '@/components/cards/JobCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import Pagination from '@/components/shared/Pagination';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { getJobDetailsList, getJobFilter } from '@/lib/actions/job.action';
import { JobI, SearchParamsProps } from '@/types';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home | Dev Overflow',
  description: 'Dev Overflow is a community of 1000000+ developers. Join us.',
};

export default async function Home({
  searchParams: { q, location, page = '1' },
}: SearchParamsProps) {
  const { countriesFilter, flags } = (await getJobFilter()) as {
    flags: { [key: string]: string };
    countriesFilter: {
      name: string;
      value: string;
    }[];
  };
  const { results } = (await getJobDetailsList({
    filter: location,
    page: parseInt(page),
    searchQuery: q,
  })) as { results: JobI[] };

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Jobs</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />

        <Filter
          filters={countriesFilter as unknown as any}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          icon="/assets/icons/carbon-location.svg"
          filter="location"
        />
      </div>
      <div className="mt-10 flex w-full flex-col gap-6">
        {results && results?.length !== 0 ? (
          results?.map((job: JobI) => (
            <JobCard
              key={job?.job_id}
              job={job}
              flag={flags[job.job_country]}
            />
          ))
        ) : (
          <NoResult
            title="There’s no jobs to show"
            description="Ajust your search! 💡"
          />
        )}

        <Pagination isNext={true} />
      </div>
    </>
  );
}
