import { usePathname } from 'next/navigation';
const useIsAuditorLoggedIn = () => {
  const pathname = usePathname();
  return pathname?.includes('auditor') || false;
};

export default useIsAuditorLoggedIn;
