import React from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Props {
  items: any[];
  placeholder: string;
}

const Filters = ({ items, placeholder }: Props) => {
  return (
    <Select>
      <SelectTrigger
        className="
      body-regular light-border 
      background-light800_dark300 
      text-dark500_light700 
       h-9 min-h-[56px] w-full 
      rounded-md border 
      border-slate-200 
      bg-transparent px-5 py-2.5 
      text-sm shadow-sm ring-offset-white 
      placeholder:text-slate-500 focus:outline-none 
      focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed 
      disabled:opacity-50 dark:border-slate-800 dark:ring-offset-slate-950 
      dark:placeholder:text-slate-400 dark:focus:ring-slate-300 sm:min-w-[170px]"
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem
              key={item}
              value={item}
              className="cursor-pointer hover:bg-slate-100"
            >
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default Filters;
