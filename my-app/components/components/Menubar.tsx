'use client';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

type Props = {};

const Menubar = (props: Props) => {
  const router = useRouter();

  return (
    <div className="flex gap-4">
      <Button onClick={() => router.push('/homepage')}>My Plans</Button>
      <Button onClick={() => router.push('/homepage/completed')}>
        Completed
      </Button>
    </div>
  );
};

export default Menubar;
