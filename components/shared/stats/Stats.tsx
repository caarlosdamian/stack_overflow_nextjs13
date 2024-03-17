import Image from 'next/image';
import React from 'react';
interface Props {
  icon: string;
  count: string;
  label: string;
}

const Stats = ({ count, icon, label }: Props) => {
  return (
    <div className='flex items-center gap-1'>
      <Image src={icon} alt={label} height={16} width={16} />
      <span className='text-dark400_light800 small-regular'>{`${count} ${label}`}</span>
    </div>
  );
};

export default Stats;
