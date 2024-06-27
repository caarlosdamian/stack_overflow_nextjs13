import TagCard from '@/components/cards/TagCard';
import Filter from '@/components/shared/Filter';
import NoResult from '@/components/shared/NoResult';
import LocalSearchbar from '@/components/shared/search/LocalSearchbar';
import { TagFilters } from '@/constants/filters';
import { getAllTags } from '@/lib/actions/tag.action';
import React from 'react';

const Tags = async () => {
  const { tags } = await getAllTags({});

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Tags</h1>

      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tag"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search by tag name..."
          otherClasses="flex-1"
        />

        <Filter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {tags.length > 0 ? (
          tags.map((tag: any) => <TagCard key={tag._id} tag={tag} />)
        ) : (
          <NoResult
            title="No Tags found"
            link="/askaquestion"
            description="No tags"
            linkTitle="As a question"
          />
        )}
      </section>
    </>
  );
};

export default Tags;
