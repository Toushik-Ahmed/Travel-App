import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DestinationSelectorProps {
  destinations: string[];
  onFilterChange: (filter: string) => void;
  placeholder: string;
  selectedValue: string;
}

const DestinationSelector: React.FC<DestinationSelectorProps> = ({
  destinations,
  onFilterChange,
  placeholder,
  selectedValue
}) => {
  return (
    <div>
      <Select  value={selectedValue} onValueChange={onFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {destinations.map((destination) => (
            <SelectItem key={destination} value={destination}>
              {destination}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DestinationSelector;
