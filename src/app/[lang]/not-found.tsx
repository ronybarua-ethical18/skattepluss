import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ErrorImg from '../../../public/Error.svg';

const NotFound: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex py-8 flex-col justify-end gap-[24px] items-center rounded-lg w-[290px]">
        <Image src={ErrorImg} alt="Error Image" width={210} height={110} />
        <h1>Oops, page is not found!</h1>
        <h3 className="text-gray-500 text-sm">
          This link might be broken or corrupted.
        </h3>
        <Link href="/">
          <Button className="text-white" variant={'purple'}>
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
