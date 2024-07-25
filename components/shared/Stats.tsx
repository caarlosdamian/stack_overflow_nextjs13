import React from 'react';
import Image from 'next/image';
import { formatAndDivideNumber } from '@/lib/utils';
import { BadgeCounts } from '@/types';

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  badgeCounts: BadgeCounts;
  reputation: number;
}

interface PropsStats {
  type: 'silver' | 'gold' | 'bronze';
  amount: number;
}

const types = {
  silver: 'Silver',
  gold: 'Gold',
  bronze: 'Bronze',
};

const StatsCard = ({ type, amount }: PropsStats) => {
  return (
    <div
      className="light-border background-light900_dark200 flex flex-wrap items-center justify-start gap-4
        rounded-md border p-6 shadow-light-300 dark:shadow-dark-200"
    >
      <Image
        height={50}
        width={40}
        src={`/assets/icons/${type}-medal.svg`}
        alt={`${type} medal`}
      />
      <div className="flex flex-col">
        <p className="paragraph-semibold text-dark200_light900">{amount}</p>
        <p className="body-medium text-dark400_light700">{`${types[type]} Badges`}</p>
      </div>
    </div>
  );
};

const Stats = ({
  totalQuestions,
  totalAnswers,
  badgeCounts,
  reputation,
}: Props) => {
  return (
    <div className="mt-10">
      <h4 className="h3-semibold text-dark200_light900">
        Stats - {reputation}
      </h4>
      <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
        <div
          className="light-border background-light900_dark200 flex flex-wrap items-center justify-evenly gap-4
        rounded-md border p-6 shadow-light-300 dark:shadow-dark-200
        "
        >
          <div className="paragraph-semibold text-dark200_light900">
            <p>{formatAndDivideNumber(totalQuestions)}</p>
            <p className="body-medium text-dark400_light900">Questions</p>
          </div>
          <div className="paragraph-semibold text-dark200_light900">
            <p>{formatAndDivideNumber(totalAnswers)}</p>
            <p className="body-medium text-dark400_light900">Answers</p>
          </div>
        </div>
        <StatsCard amount={badgeCounts.BRONZE} type="bronze" />
        <StatsCard amount={badgeCounts.SILVER} type="silver" />
        <StatsCard amount={badgeCounts.GOLD} type="gold" />
      </div>
    </div>
  );
};

export default Stats;
