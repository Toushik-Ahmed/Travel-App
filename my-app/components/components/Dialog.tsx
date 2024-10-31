import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Itinerary } from '@/redux/itineraryslice';
import { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface DialogCompProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: Itinerary | null;
  onUpdate: (updatedItinerary: Itinerary) => void;
}

const DialogComp: React.FC<DialogCompProps> = ({
  isOpen,
  onClose,
  itinerary,
  onUpdate,
}) => {
  const [formData, setFormData] = useState({
    tripName: '',
    startDate: '',
    endDate: '',
    destinations: '',
    description: '',
    category: '',
    activities: {} as { [destination: string]: string[] },
  });

  useEffect(() => {
    if (itinerary) {
      setFormData({
        tripName: itinerary.tripName,
        startDate: itinerary.startDate,
        endDate: itinerary.endDate,
        destinations: itinerary.destinations.join(', '),
        description: itinerary.description,
        category: itinerary.category || '',
        activities: itinerary.activities || {},
      });
    }
  }, [itinerary]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'destinations') {
      setFormData((prev) => {
        const newDestinations = value.split(',').map((d) => d.trim());
        const oldDestinations = prev.destinations.split(',').map((d) => d.trim());


        const updatedActivities = { ...prev.activities };
        oldDestinations.forEach((dest) => {
          if (!newDestinations.includes(dest)) {
            delete updatedActivities[dest];
          }
        });

       
        newDestinations.forEach((dest) => {
          if (!updatedActivities[dest]) {
            updatedActivities[dest] = [];
          }
        });

        return { ...prev, activities: updatedActivities };
      });
    }
  };

  const handleActivityChange = (destination: string, activities: string) => {
    setFormData((prev) => ({
      ...prev,
      activities: {
        ...prev.activities,
        [destination]: activities.split(','),
      },
    }));
  };

  const handleSubmit = () => {
    const destinations = formData.destinations
      .split(',')
      .map((dest) => dest.trim());
    const updatedItinerary = {
      ...itinerary,
      ...formData,
      destinations,
      activities: Object.fromEntries(
        Object.entries(formData.activities)
          .filter(([dest]) => destinations.includes(dest))
          .map(([dest, acts]) => [
            dest,
            acts.map((act) => act.trim()).filter((act) => act !== ''),
          ])
      ),
    };

    onUpdate(updatedItinerary as Itinerary);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Itinerary</DialogTitle>
          <DialogDescription>Make changes to your itinerary.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="tripName">Trip Name</Label>
            <Input
              name="tripName"
              value={formData.tripName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="destinations">Destinations</Label>
            <Input
              name="destinations"
              value={formData.destinations}
              onChange={handleInputChange}
            />
          </div>
          {formData.destinations.split(',').map((destination, index) => (
            <div key={index}>
              <Label htmlFor={`activities-${index}`}>
                Activities for {destination.trim()}
              </Label>
              <Input
                name={`activities-${index}`}
                value={
                  formData.activities[destination.trim()]?.join(', ') || ''
                }
                onChange={(e) =>
                  handleActivityChange(destination.trim(), e.target.value)
                }
              />
            </div>
          ))}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              name="category"
              value={formData.category}
              onChange={handleInputChange}
            />
          </div>
          <Button onClick={handleSubmit}>Update</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogComp;
