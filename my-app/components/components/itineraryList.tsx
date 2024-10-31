import {
  deleteItineraryFunc,
  getAllIteneraries,
  updateItenerary,
} from '@/redux/itineraryslice';
import { AppDispatch, RootState } from '@/redux/store';
import { getLoggedInUser } from '@/redux/userSlice';
import { format, isWithinInterval, parseISO } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBack2Fill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '../ui/button';

import { DatePickerWithRange } from './DateRangeSelector';
import DialogComp from './Dialog';
import SelectorComp from './SelectorComp';
import { useRouter } from 'next/navigation';

interface ItineraryListProps {
  onToggleMap: (itinerary: any) => void;
  selectedItinerary: any | null;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
  onToggleMap,
  selectedItinerary,
}) => {
  const router=useRouter()
  const dispatch = useDispatch<AppDispatch>();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItinerary, setEditingItinerary] = useState<any | null>(null);
  const [filter, setFilter] = useState<string>('');
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({
    startDate: null,
    endDate: null,
  });

  const [showLists, setShowlists] = useState(true);

  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  const currentUser = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (currentUser?.id) {
      dispatch(getAllIteneraries(currentUser.id));
    }
  }, [dispatch, currentUser]);

  const itineraries = useSelector(
    (state: RootState) => state.itinerary.itineraries || []
  );

  const handleDelete = (id: string) => {
    if (id) dispatch(deleteItineraryFunc(id));
  };

  const handleEdit = (itinerary: any) => {
    setEditingItinerary(itinerary);
    setIsDialogOpen(true);
  };

  const handleUpdate = (updatedItinerary: any) => {
    dispatch(updateItenerary(updatedItinerary));
    setIsDialogOpen(false);
  };

  const destinations = Array.from(
    new Set(itineraries.flatMap((itinerary) => itinerary.destinations))
  );

  const filteredItineraries = itineraries.filter((itinerary) => {
    const isDestinationMatch = filter
      ? itinerary.destinations.some((destination: string) =>
          destination.toLowerCase().includes(filter.toLowerCase())
        )
      : true;

    const itineraryStartDate = parseISO(itinerary.startDate);
    const itineraryEndDate = parseISO(itinerary.endDate);

    const isDateInRange =
      dateRange.startDate && dateRange.endDate
        ? isWithinInterval(itineraryStartDate, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          }) ||
          isWithinInterval(itineraryEndDate, {
            start: dateRange.startDate,
            end: dateRange.endDate,
          })
        : true;

    return isDestinationMatch && isDateInRange;
  });

  // Function to reset filters
  const handleResetFilters = () => {
    setFilter('');
    setDateRange({
      startDate: null,
      endDate: null,
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">My Plans</h1>

      <div className="mb-4 flex justify-end">
        <div className="flex gap-4 items-center ">
          <div>
            <h2 className="text-lg font-medium">Filter by Date Range</h2>
            <DatePickerWithRange
              className="mb-4"
              onChange={(range: {
                startDate: Date | null;
                endDate: Date | null;
              }) =>
                setDateRange({
                  startDate: range.startDate,
                  endDate: range.endDate,
                })
              }
              startDate={dateRange.startDate}
              endDate={dateRange.endDate}
            />
          </div>

          <div className="mb-4">
            <h2 className="text-lg font-medium">Filter by Destination</h2>
            <SelectorComp
              placeholder="Filter by Destination"
              destinations={destinations}
              onFilterChange={(selectedFilter: string) =>
                setFilter(selectedFilter)
              }
              selectedValue={filter}
            />
          </div>

          {/* Reset Filters Button */}
          <div className="mb-4">
            <h2 className="text-lg font-medium text-center">Reset</h2>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset
            </Button>
          </div>
        </div>
      </div>

      {filteredItineraries.length === 0 ? (
        <p>No matching itineraries found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItineraries.map((itinerary) => (
            <div
              key={itinerary.id}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex flex-col justify-between h-[100%]">
                <div className="flex flex-col gap-4">
                  <h3 className="text-lg font-semibold text-blue-600 mb-2">
                    {itinerary.tripName}
                  </h3>
                  <p>
                    <strong>
                      {format(parseISO(itinerary.startDate), 'MMM dd, yyyy')} to{' '}
                      {format(parseISO(itinerary.endDate), 'MMM dd, yyyy')}
                    </strong>
                  </p>
                  <p>
                    <strong>Destinations:</strong>{' '}
                    {itinerary.destinations.join(', ')}
                  </p>
                  <p>
                    <strong>Category:</strong> {itinerary.category}
                  </p>

                  {/* Display Activities */}
                  <p>
                    <strong>Activities:</strong>{' '}
                    {itinerary.activities
                      ? Object.entries(itinerary.activities).map(
                          ([destination, activities]) => (
                            <div key={destination}>
                              <strong>{destination}:</strong>{' '}
                              {activities.join(', ')}
                            </div>
                          )
                        )
                      : 'No activities'}
                  </p>

                  <p>
                    <strong>Description:</strong> {itinerary.description}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div className="flex gap-4">
                    <Button
                      variant="ghost"
                      onClick={() => handleEdit(itinerary)}
                    >
                      <CiEdit />
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleDelete(itinerary.id!)}
                    >
                      <RiDeleteBack2Fill />
                    </Button>
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      variant="outline"
                      onClick={() => onToggleMap(itinerary)}
                    >
                      {selectedItinerary && selectedItinerary.id === itinerary.id
                        ? 'Hide Map'
                        : 'Show Map'}
                    </Button>
                    <Button onClick={()=>router.push(`/homepage/budget/${itinerary.id}`)}>Expense</Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {editingItinerary && (
        <DialogComp
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          itinerary={editingItinerary}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default ItineraryList;
