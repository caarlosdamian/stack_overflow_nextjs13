import { formatLocation, formatSalaryRange } from '@/lib/utils';
import { JobI } from '@/types';
import Image from 'next/image';
import React from 'react';

interface Props {
  job: JobI;
  flag: string;
}

export const JobCard = ({ job, flag }: Props) => {
  return (
    <div className="card-wrapper rounded-[10px] p-9 sm:px-11">
      <div className="flex gap-4">
        <div className="">
          <a
            target="_blank"
            href={job?.employer_website || '/'}
            className="background-light800_dark400 relative flex size-16 items-center justify-center  rounded-xl"
            aria-label={`Visit ${job?.employer_name} website`}
          >
            <Image
              src={job?.employer_logo || '/assets/images/site-logo.svg'}
              alt={`${job?.employer_name || 'Company'} logo`}
              width={48}
              height={48}
              className="object-contain"
            />
          </a>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex-between w-full flex-wrap gap-2">
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {job?.job_title}
            </h3>
            <div className="background-light800_dark400 flex items-center justify-end  gap-2 rounded-2xl px-3 py-1.5">
              <p className="body-medium text-dark400_light700">
                {formatLocation(job.job_city, job.job_state, job.job_country)}
              </p>
              <span aria-hidden="true">{flag}</span>
            </div>
          </div>
          <div className="line-clamp-3">
            <p className="body-regular text-dark500_light700 line-clamp-2">
              {job?.job_description}
            </p>
          </div>
          <div className="flex-between mt-8 flex-wrap gap-6">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/clock-2.svg"
                  alt="Employment type icon"
                  width={20}
                  height={20}
                />
                <p className="body-medium text-light-500">
                  {job?.job_employment_type}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Image
                  src="/assets/icons/currency-dollar-circle.svg"
                  alt="Salary range icon"
                  width={20}
                  height={20}
                />
                <p className="body-medium text-light-500">
                  {formatSalaryRange(job.job_min_salary, job.job_max_salary)}
                </p>
              </div>
            </div>
            <a
              target="_blank"
              href={job?.job_apply_link}
              className="flex items-center gap-2"
              aria-label="Apply for job"
            >
              <Image
                src="/assets/icons/arrow-up-right.svg"
                alt="Apply for job icon"
                width={20}
                height={20}
              />
              <p className="body-semibold primary-text-gradient">View Job</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
