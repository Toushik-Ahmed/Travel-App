'use client';
import Budget from '@/components/components/Budget';
import { useParams } from 'next/navigation';

type Props = {};

const page = (props: Props) => {
  const params = useParams();
  const budgetId = params.budgetId as string;
  console.log(budgetId);

  return (
    <div className="flex  justify-center">
      <Budget budgetId={budgetId} />
    </div>
  );
};

export default page;
