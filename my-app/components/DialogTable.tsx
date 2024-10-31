'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Budget, editBudget, postBudget } from '@/redux/budgetSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

type Props = {
  budget?: Budget;
  variant?: string;
  placeholder?: string | React.ReactNode;
  tripId?: string;
};

export function DialogDemo({ variant, placeholder, tripId, budget }: Props) {
  const [open, setOpen] = useState(false);

  const [budgetInfo, setBudgetInfo] = useState({
    budget: budget?.budget || '',
    expense: budget?.expense || '',
    category: budget?.category || '',
    tripId: budget?.tripId || tripId,
  });

  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.user);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { name, value } = e.target;
    setBudgetInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (budget) {
      dispatch(editBudget({ ...budgetInfo, id: budget.id }));
      setOpen(false);
      console.log('budgetInfo', budgetInfo);
    } else {
      dispatch(postBudget(budgetInfo));
      console.log('budgetInfo', budgetInfo);
      setBudgetInfo({
        budget: '',
        expense: '',
        category: '',
        tripId: tripId || budgetInfo.tripId || '',
      });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant as 'ghost' | 'default'}>{placeholder}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form action="" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Budget Management</DialogTitle>
            <DialogDescription>keep track your budget</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Category
              </Label>
              <Input
                id="category"
                name="category"
                value={budgetInfo.category}
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget
              </Label>
              <Input
                id="budget"
                name="budget"
                value={budgetInfo.budget}
                className="col-span-3"
                onChange={handleChange}
              />
            </div>
            {budget && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="expense" className="text-right">
                  Expense
                </Label>
                <Input
                  id="expense"
                  name="expense"
                  value={budgetInfo.expense}
                  className="col-span-3"
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button className="w-full" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
