import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Budget, deleteBudget } from '@/redux/budgetSlice';
import { AppDispatch } from '@/redux/store';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { DialogDemo } from '../DialogTable';
import { Button } from '../ui/button';

type Props = {
  budgets: Budget[];
};

const TableComp = ({ budgets }: Props) => {
  const th = ['Category', 'Budget', 'Expense', 'Edit', 'Delete'];
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="bg-white">
      <Table>
        <TableCaption className="font-bold">
          Budget and Expense Information
        </TableCaption>
        <TableHeader>
          <TableRow>
            {th.map((header, index) => (
              <TableHead className="w-[100px]" key={index}>
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.map((budget, index) => (
            <TableRow key={index}>
              <TableCell className="text-left">{budget.category}</TableCell>
              <TableCell className="text-left">{budget.budget}</TableCell>
              <TableCell className="text-left">{budget.expense}</TableCell>
              <TableCell className="text-left">
                <DialogDemo
                  variant="ghost"
                  placeholder={<CiEdit />}
                  budget={budget}
                />
              </TableCell>
              <TableCell className="text-left">
                <Button
                  onClick={() => dispatch(deleteBudget(budget.id!))}
                  variant="ghost"
                >
                  <MdDelete className="text-red-500" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComp;
