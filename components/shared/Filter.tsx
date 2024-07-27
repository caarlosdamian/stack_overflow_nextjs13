'use client';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formUrlQuery } from '@/lib/utils';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
  icon?: string;
  filter?: string;
}

const Filter = ({
  filters,
  otherClasses,
  containerClasses,
  icon,
  filter,
}: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramFilter = searchParams.get(filter || 'filter');

  const handleFilter = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: filter || 'filter',
      value,
    });
    router.push(newUrl);
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleFilter}
        defaultValue={paramFilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex flex-1 items-center gap-3 text-left">
            {icon && <Image src={icon} alt="icon" width={18} height={18} />}
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular max-h-40 overflow-scroll border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters?.map((item) => (
              <SelectItem
                key={item.value}
                value={item.value}
                className="line-clamp-1 max-w-[210px] cursor-pointer focus:bg-light-800	dark:focus:bg-dark-400"
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
