import {
  Itinerary,
  postItenerary,
  updateItenerary,
} from '@/redux/itineraryslice';
import { AppDispatch, RootState } from '@/redux/store';
import { getLoggedInUser } from '@/redux/userSlice';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface ItineraryFormProps {
  existingItinerary?: Itinerary;
  onClose: () => void;
}

export interface ActivityObject {
  [destination: string]: string;
}

const ItineraryForm: React.FC<ItineraryFormProps> = ({
  existingItinerary,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(getLoggedInUser());
  }, [dispatch]);

  const currentUser = useSelector((state: RootState) => state.user.user);

  const [tripName, setTripName] = useState(existingItinerary?.tripName || '');
  const [startDate, setStartDate] = useState(
    existingItinerary?.startDate || ''
  );
  const [endDate, setEndDate] = useState(existingItinerary?.endDate || '');
  const [destinations, setDestinations] = useState(
    existingItinerary?.destinations
      ? existingItinerary.destinations.join(', ')
      : ''
  );
  const [description, setDescription] = useState(
    existingItinerary?.description || ''
  );
  const [category, setCategory] = useState(existingItinerary?.category || '');

  const [activities, setActivities] = useState<ActivityObject[]>(
    existingItinerary?.activities
      ? Object.entries(existingItinerary.activities).map(
          ([destination, activityDesc]) => ({
            [destination]: Array.isArray(activityDesc)
              ? activityDesc[0]
              : activityDesc,
          })
        )
      : []
  );

  const addActivity = () => {
    setActivities([...activities, { '': '' }]);
  };

  const handleActivityChange = (
    index: number,
    destination: string,
    activity: string
  ) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = { [destination]: activity };
    setActivities(updatedActivities);
  };

  const handleSubmit = () => {
    const destinationList = destinations.split(',').map((dest) => dest.trim());

    const activitiesObject = activities.reduce((acc, activity) => {
      const [destination, activityDesc] = Object.entries(activity)[0];
      if (!acc[destination]) {
        acc[destination] = [];
      }
      acc[destination].push(activityDesc);
      return acc;
    }, {} as { [destination: string]: string[] });

    const itinerary: Itinerary = {
      id: existingItinerary?.id || nanoid(),
      tripName,
      startDate,
      endDate,
      destinations: destinationList,
      description,
      category,
      activities: activitiesObject,
      userId: currentUser?.id,
    };

    if (existingItinerary) {
      dispatch(updateItenerary(itinerary));
    } else {
      dispatch(postItenerary(itinerary));
    }

    onClose();
  };
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white relative">
      <button
        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
        onClick={onClose}
      >
        <RiCloseCircleLine />
      </button>
      <h2 className="text-lg font-semibold mb-4">
        {existingItinerary ? 'Edit Itinerary' : 'Add Itinerary'}
      </h2>
      <Input
        value={tripName}
        onChange={(e) => setTripName(e.target.value)}
        placeholder="Trip Name"
        className="mb-3"
      />
      <Input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        placeholder="Start Date"
        className="mb-3"
      />
      <Input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        placeholder="End Date"
        className="mb-3"
      />
      <Textarea
        value={destinations}
        onChange={(e) => setDestinations(e.target.value)}
        placeholder="Destinations (comma separated)"
        className="mb-3"
      />
      <Textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Short Description"
        className="mb-3"
      />
      <Input
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Category"
        className="mb-3"
      />

      
      {activities.map((activityObj, index) => {
        const [destination, activity] = Object.entries(activityObj)[0];
        return (
          <div key={index} className="mb-3">
            <Input
              value={destination}
              onChange={(e) =>
                handleActivityChange(index, e.target.value, activity)
              }
              placeholder="Destination"
              className="mb-1"
            />
            <Input
              value={activity}
              onChange={(e) =>
                handleActivityChange(index, destination, e.target.value)
              }
              placeholder="Activity"
              className="mb-1"
            />
          </div>
        );
      })}

      <div className="flex gap-4">
        <Button onClick={addActivity} className="mt-4">
          Add Activity
        </Button>

        <Button onClick={handleSubmit} className="mt-4">
          {existingItinerary ? 'Update Itinerary' : 'Add Itinerary'}
        </Button>
      </div>
    </div>
  );
};
export default ItineraryForm;
