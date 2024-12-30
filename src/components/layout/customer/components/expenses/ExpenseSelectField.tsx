import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SelectFieldProps {
  label: string;
  placeholder: string;
  items: Array<{ value: string; label: string }>;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  placeholder,
  items,
}) => {
  return (
    <div>
      <div className="text-gray-800 text-xs font-semibold">{label}</div>
      <Select>
        <SelectTrigger className="w-full text-xs text-gray-600">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SelectField;
