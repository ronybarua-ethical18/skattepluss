import * as React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type OptionType = {
  title: string;
  value: string;
};
interface SelectInputProps {
  options: OptionType[];
  onChange: (value: string) => void;
  selectedOption?: string;
  label?: string;
  id?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  error?: string;
}

const SelectInput = ({
  options,
  onChange,
  selectedOption,
  label,
  id = 'select-input',
  required = false,
  className = 'w-[300px]',
  placeholder = 'Select a option',
  error,
}: SelectInputProps) => {
  return (
    <div className="grid w-full gap-1.5">
      {label && (
        <Label
          htmlFor={id}
          className={
            error ? 'text-destructive' : 'text-sm text-muted-foreground mb-2'
          }
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <Select value={selectedOption} onValueChange={onChange}>
        <SelectTrigger
          id={id}
          className={`${className} ${error ? 'border-destructive' : ''}`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options?.map((option, i) => (
              <SelectItem key={i} value={option?.value}>
                {option?.title}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
};

export default SelectInput;
