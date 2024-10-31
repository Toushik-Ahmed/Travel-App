import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CompleteItinerary, postSummary } from '@/redux/completedTourSlice';
import { AppDispatch, RootState } from '@/redux/store';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ActivityObject } from './IteneraryForm';
import DestinationSelector from './SelectorComp';

type Props = {};

const SummaryDialog = (props: Props) => {
  const ItineraryList = useSelector(
    (state: RootState) => state.itinerary.itineraries
  );
  const tripnames = ItineraryList.map((itinerary) => itinerary.tripName);

  const [selectedTrip, setSelectedTrip] = useState<string>('');
  const [tripInfo, setTripInfo] = useState<any | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [destinations, setDestinations] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivityObject>({});
  const [cost, setCost] = useState<string>('');
  const [distance, setDistance] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [postData, setPostData] = useState<CompleteItinerary | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const handleTripChange = (tripName: string) => {
    setSelectedTrip(tripName);
    const selectedItinerary = ItineraryList.find(
      (itinerary) => itinerary.tripName === tripName
    );
    setTripInfo(selectedItinerary || null);

    setCost('');
    setDistance('');
    setSummary('');

    if (selectedItinerary) {
      setDestinations(selectedItinerary.destinations);
      setActivities(
        Object.fromEntries(
          Object.entries(selectedItinerary.activities).map(([key, value]) => [
            key,
            value.join(', '),
          ])
        )
      );
      setStartDate(selectedItinerary.startDate);
      setEndDate(selectedItinerary.endDate);
    } else {
      setDestinations([]);
      setActivities({});
    }
  };
  const handleReset = () => {
    setSelectedTrip('');
    setTripInfo(null);
    setCost('');
    setDistance('');
    setSummary('');
    setDestinations([]);
    setActivities({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: CompleteItinerary = {
      tripName: selectedTrip,
      description: tripInfo?.description,
      category: tripInfo?.category,
      activities: Object.fromEntries(
        Object.entries(activities).map(([key, value]) => [
          key,
          value.split(', '),
        ])
      ),
      destinations: destinations,
      startDate: startDate,
      endDate: endDate,
      cost: cost,
      travelledDistance: distance,
      summary: summary,
    };
    setPostData(data);
    dispatch(postSummary(data));
    console.log(data);
  };
  const handleDestinationsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinations(value.split(',').map((dest) => dest.trim()));
  };

  const handleActivitiesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    const activitiesArray = value.split('\n').map((line) => line.trim());
    const activityObj = activitiesArray.reduce((acc, activity) => {
      const [dest, acts] = activity.split(':').map((part) => part.trim());
      if (dest && acts) {
        acc[dest] = acts
          .split(',')
          .map((act) => act.trim())
          .join(', ');
      }
      return acc;
    }, {} as ActivityObject);
    setActivities(activityObj);
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger className="bg-black text-white p-2 rounded-md">
          Select Trip
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Summary</DialogTitle>
            <DialogDescription>
              Select a trip and edit its details.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="tripSelector">Select a trip:</Label>
              <DestinationSelector
                onFilterChange={handleTripChange}
                destinations={tripnames}
                placeholder="select trip"
              />
            </div>

            {tripInfo && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">{tripInfo.tripName}</h2>
                <Label htmlFor="startDate">Start Date:</Label>
                <Input
                  type="text"
                  id="startDate"
                  value={startDate}
                  className="border rounded p-1"
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <Label htmlFor="endDate">End Date:</Label>
                <Input
                  type="text"
                  id="endDate"
                  value={endDate}
                  className="border rounded p-1"
                  onChange={(e) => setEndDate(e.target.value)}
                />

                <Label htmlFor="destinations">Destinations:</Label>
                <Input
                  type="text"
                  id="destinations"
                  value={destinations.join(', ')}
                  className="border rounded p-1"
                  onChange={handleDestinationsChange}
                />

                <Label htmlFor="activities">Activities:</Label>
                <Textarea
                  id="activities"
                  value={Object.entries(activities)
                    .map(
                      ([dest, acts]) =>
                        `${dest}: ${
                          Array.isArray(acts) ? acts.join(', ') : acts
                        }`
                    )
                    .join('\n')} 
                  className="border rounded p-1 h-20"
                  onChange={handleActivitiesChange}
                />

                <Label htmlFor="cost">Cost:</Label>
                <Input
                  type="text"
                  id="cost"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="border rounded p-1"
                />

                <Label htmlFor="distance">Total Distance Travelled:</Label>
                <Input
                  type="text"
                  id="distance"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="border rounded p-1"
                />

                <Label htmlFor="summary">Summary:</Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="border rounded p-1 h-20"
                />
              </div>
            )}

            <Button className="mt-4 w-full text-white rounded p-2">Save</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SummaryDialog;
