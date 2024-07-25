import Profile from '@/components/forms/Profile';
import { getUserById } from '@/lib/actions/user.action';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const EditProfilePage = async () => {
  const { userId } = auth();
  if (!userId) return;
  const userInfo = await getUserById({ userId });
  if (!userInfo) return;

  return (
    <>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <div className="mt-9">
        <Profile defaultValues={userInfo} userId={userId} />
      </div>
    </>
  );
};

export default EditProfilePage;
