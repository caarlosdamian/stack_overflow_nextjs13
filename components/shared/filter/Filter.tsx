'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  filters: { name: string; value: string }[];
  otherClasses?: string;
  containerClasses?: string;
  placeholder?: string;
}

const Filter = ({
  filters,
  placeholder = 'Select a Filter',
  otherClasses,
  containerClasses,
}: Props) => {
  return (
    <div className={`relative w-full self-start ${containerClasses}`}>
      <Select>
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 px-5 py-2.5`}
        >
          <div className="text-dark100_light900 line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className='background-light800_dark400'>
          <SelectGroup className='text-dark200_light900'>
            {filters.map(({ name, value }) => (
              <SelectItem
                key={value}
                value={value}
                className="hover:background-light800_dark400 cursor-pointer"
              >
                {name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
