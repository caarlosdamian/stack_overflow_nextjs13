'use client';
import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { SignedOut } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const LeftSidebar = () => {
  const pathname = usePathname();
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky left-0 top-0 flex h-screen w-fit flex-col justify-between  overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-sm:hidden lg:w-[266px]">
      <div className="flex h-full flex-1 flex-col gap-6">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;
          return (
            <>
              <Link
                href={link.route}
                className={`${
                  isActive
                    ? 'primary-gradient rounded-lg text-light-900'
                    : 'text-dark300_light900'
                } flex items-center justify-start gap-4 bg-transparent p-4`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={20}
                  height={20}
                  className={`${isActive ? '' : 'invert-colors'}`}
                />
                <p
                  className={`${
                    isActive ? 'base-bold' : 'base-medium'
                  } hidden lg:flex`}
                >
                  {link.label}
                </p>
              </Link>
            </>
          );
        })}
      </div>
      <SignedOut>
        <div className="flex w-full flex-col gap-3">
          <Link href="/sing-in">
            <Button className="small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className="primary-text-gradient hidden lg:flex">
                Log in
              </span>
              <Image
                src="/assets/icons/sign-up.svg"
                alt="sign-up"
                width={20}
                height={20}
                className="invert-colors md:hidden"
              />
            </Button>
          </Link>
          <Link href="/sing-up">
            <Button className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none">
              <span className="primary-text-gradient hidden lg:flex">
                Sing up
              </span>
              <Image
                src="/assets/icons/avatar.svg"
                alt="sign-up"
                width={20}
                height={20}
                className="invert-colors md:hidden"
              />
            </Button>
          </Link>
        </div>
      </SignedOut>
    </section>
  );
};

export default LeftSidebar;
