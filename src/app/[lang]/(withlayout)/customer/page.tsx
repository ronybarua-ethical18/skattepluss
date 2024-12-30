/* eslint-disable @next/next/no-img-element */
'use client';
import { useSession, signOut } from 'next-auth/react';
import React from 'react';
import { FaCheckCircle, FaUser, FaEnvelope } from 'react-icons/fa'; // Import icons from react-icons

const UserProfilePage: React.FC = () => {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-1/3  text-center">
          {/* Congrats Message */}
          <div className="flex items-center justify-center text-green-600">
            <FaCheckCircle className="h-12 w-12 mr-2" />
            <h2 className="text-2xl font-bold">
              Congratulations, {session?.user?.name}!
            </h2>
          </div>

          <p className="text-gray-600 mt-2">
            Welcome back! We are so glad to see you here. 🎉
          </p>

          {/* User Profile Image */}
          <img
            className="w-24 h-24 rounded-full mx-auto mt-6"
            src={session?.user?.image || '/default-avatar.png'} // Fallback to default image
            alt="User profile"
          />

          {/* User Information */}
          <div className="mt-4">
            <div className="flex items-center justify-center text-gray-800">
              <FaUser className="h-5 w-5 mr-2" />
              <h3 className="text-xl">{session?.user?.name}</h3>
            </div>

            <div className="flex items-center justify-center text-gray-500 mt-2">
              <FaEnvelope className="h-5 w-5 mr-2" />
              <p>{session?.user?.email}</p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserProfilePage;
