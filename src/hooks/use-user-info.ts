import { useSession } from 'next-auth/react';

const useUserInfo = () => {
  const { data: session } = useSession();

  return {
    isAuditor: session?.user?.role === 'auditor' ? true : false,
  };
};

export default useUserInfo;
