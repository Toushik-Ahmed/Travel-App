'use client';
import { getBudget } from '@/redux/budgetSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DialogDemo } from '../DialogTable';
import TableComp from './Table';

type Props = {
  budgetId?: string;
};

const Budget = ({ budgetId }: Props) => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getBudget(budgetId!));
  }, [budgetId]);
  const budgetInformation = useSelector(
    (state: RootState) => state.budget.budgets
  );

  const totalBudget = budgetInformation.reduce(
    (total, budget) => total + Number(budget.budget),
    0
  );
  const totalExpense = budgetInformation.reduce(
    (total, budget) => total + Number(budget.expense),
    0
  );

  return (
    <div className="mt-8 w-[50%]">
      <h1 className="text-center font-bold  ">Budget vs Expense Table </h1>

      <div className="flex justify-end mr-10 -scroll-mb-6">
        <DialogDemo
          variant="default"
          placeholder="Add Budget"
          tripId={budgetId}
        />
      </div>
      <div className="mt-8">
        <TableComp
          budgets={budgetInformation}
          totalBudget={totalBudget}
          totalExpense={totalExpense}
        />
      </div>
    </div>
  );
};

export default Budget;
