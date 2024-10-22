import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, useState, forwardRef, useEffect } from 'react'
import styles from './styles.module.css'
import { IMaskInput } from 'react-imask'

import ReactDatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

import "react-datepicker/dist/react-datepicker.css";
import { ptBR } from 'date-fns/locale/pt-BR';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> { }
interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { }
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> { }

registerLocale("pt-BR", ptBR)
setDefaultLocale("pt-BR");

interface CustomInputProps {
  readOnly?: boolean,
  type?: string,
  name?: string,
  id?: string,
  placeholder?: string
  autoComplete?: string
  defaultValue?: string
  value?: string
  disabled?:boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  onValueChange?: (value: string) => void;
}

interface MultiSelectProps {
  options: { value: string, label: string }[];
  selectedValues: string[];
  onChange: (selected: string[]) => void;
  searchText: string
  defaultValue?: string[]
  id?: string
}



export function Select({ ...rest }: SelectProps) {
  return (
    <select className={styles.input} {...rest} >
    </select>
  )
}
Select.displayName = "Select";

export const MultiSelect: React.FC<MultiSelectProps> = ({ options, selectedValues, onChange, searchText }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSelectAll = () => {
    if (selectedValues.length === options.length) {
      onChange([]);
    } else {
      onChange(options.map(option => option.value));
    }
  };

  const handleSelect = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(selected => selected !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border rounded p-2 w-full">
      <div className='flex flex-col md:flex-row items-center md:space-x-4 gap-2'>
        <input
          type="text"
          placeholder={searchText}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 w-full"
        />
        <button type="button" onClick={handleSelectAll} className='bg-slate-800 p-2 border rounded text-white md:w-full'>
          {selectedValues.length === options.length ? 'Desmarcar Todos' : 'Selecionar Todos'}
        </button>
      </div>
      <ul className="max-h-60 overflow-y-auto">
        {filteredOptions.map(option => (
          <li key={option.value} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleSelect(option.value)}
            />
            <label>{option.label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};
MultiSelect.displayName = "MultiSelect";

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <input ref={ref} {...props} className={styles.input} />;
});
Input.displayName = "Input";


export function DateSelect(props: CustomInputProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    if (props.onChange && date) {
      props.onChange(date as any); // Chame a função onChange passada como prop
    }
  };
  return (
    <div className='w-full flex items-center'
    >
      <ReactDatePicker
        selected={selectedDate}
        onChange={handleDateChange}
        maxDate={new Date()}
        dateFormat="dd/MM/yyyy"
        locale="pt-BR"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        name={props.name}
        className={`${styles.input} w-full`}
        customInput={
          <button type="button" className="w-full flex items-center cursor-pointer gap-2">
            <span className='w-full' >
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : 'Selecione uma data'}
            </span>
            <Calendar className='text-gray-500' />
          </button>
        }
      />
      {selectedDate && (
        <input type="hidden" name={props.name} value={format(selectedDate, "dd/MM/yyyy")} />
      )}
    </div>
  );
}
DateSelect.displayName = "DateSelect";

export function MaskedDocumentInput(props: CustomInputProps) {


  return (
    <IMaskInput
      type={props.type}
      name={props.name}
      id={props.id}
      readOnly={props.readOnly}
      className={styles.input}
      onChange={props.onChange}
      mask={[
        { mask: '000.000.000-00', maxLength: 11 },
        { mask: '00.000.000/0000-00' }
      ]}
      defaultValue={props.defaultValue}
      style={{
        backgroundColor: !props.readOnly ? '' : 'rgba(101, 98, 143, 0.219)',
      }}
    />
  )
}
MaskedDocumentInput.displayName = "MaskedDocumentInput";

export function MaskedCPFInput(props: CustomInputProps) {

  return (
    <IMaskInput
      type={props.type}
      name={props.name}
      id={props.id}
      readOnly={props.readOnly}
      className={styles.input}
      onChange={props.onChange}
      mask={[
        { mask: '000.000.000-00', maxLength: 11 }]}
      defaultValue={props.defaultValue}
      style={{
        backgroundColor: !props.readOnly ? '' : 'rgba(101, 98, 143, 0.219)',
      }}
      disabled={props.disabled}
      placeholder={props.placeholder}
    />
  )
}
MaskedCPFInput.displayName = "MaskedCPFInput";

export function MaskedCNPJInput(props: CustomInputProps) {

  return (
    <IMaskInput
      type={props.type}
      name={props.name}
      id={props.id}
      readOnly={props.readOnly}
      className={styles.input}
      onChange={props.onChange}
      mask={[
        { mask: '00.000.000/0000-00' }
      ]}
      defaultValue={props.defaultValue}
      style={{
        backgroundColor: !props.readOnly ? '' : 'rgba(101, 98, 143, 0.219)',
      }}
    />
  )
}
MaskedCNPJInput.displayName = "MaskedCPFInput";
export function MaskedPhoneInput(props: CustomInputProps) {

  // const formattedValue = formatPhoneNumber(props.defaultValue || '');

  return (
    <IMaskInput
      type={props.type}
      name={props.name}
      id={props.id}
      readOnly={props.readOnly}
      className={styles.input}
      mask={'(00) 00000-0000'}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      autoComplete={props.autoComplete}
      onChange={props.onChange}
      style={{
        backgroundColor: !props.readOnly ? '' : 'rgba(101, 98, 143, 0.219)',

      }}
    />
  )
}
MaskedPhoneInput.displayName = "MaskedPhoneInput";

export function MaskedZipInput(props: CustomInputProps) {
  return (
    <IMaskInput
      type={props.type}
      name={props.name}
      id={props.id}
      readOnly={props.readOnly}
      className={styles.input}
      mask={'00000-000'}
      placeholder={props.placeholder}
      defaultValue={props.defaultValue}
      autoComplete={props.autoComplete}
      style={{
        backgroundColor: !props.readOnly ? '' : 'rgba(101, 98, 143, 0.219)',

      }}
    />
  )
}
MaskedZipInput.displayName = "MaskedZipInput";

export function TextArea({ ...rest }: TextAreaProps) {
  return (
    <textarea className={styles.input} {...rest}></textarea>
  )
}
TextArea.displayName = "TextArea";


export function CurrencyInput({ name, placeholder, onValueChange, value: propValue }: CustomInputProps) {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const [displayValue, setDisplayValue] = useState<string>(
    propValue ? formatCurrency(Number(propValue)) : "R$ 0,00"
  );

  const parseCurrency = (value: string): number => {
    const cleanedValue = value.replace(/\D/g, '');
    return Number(cleanedValue) / 100;
  };

  const handleTotalValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const numericValue = parseCurrency(inputValue);

    setDisplayValue(formatCurrency(numericValue));

    // Pass the raw value multiplied by 100 to the parent component
    if (onValueChange) {
      onValueChange((numericValue * 100).toFixed(0)); // Arredonda para o inteiro mais próximo
    }
  };

  return (
    <input
      type="text"
      value={displayValue}
      placeholder={placeholder}
      onChange={handleTotalValueChange}
      name={name}
      className={styles.input}
    />
  );
}

interface BenefitToggleProps {
  employeeId: string;
  initialState: boolean;
  onToggle: (employeeId: string, isActive: boolean) => void;
}

export const BenefitToggle: React.FC<BenefitToggleProps> = ({ employeeId, initialState, onToggle }) => {
  const [isActive, setIsActive] = useState(initialState);

  const handleToggle = () => {
      const newState = !isActive;
      setIsActive(newState);
      onToggle(employeeId, newState);
  };

  return (
      <div className="flex items-center">
          <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                  isActive ? 'bg-green-500' : 'bg-gray-200'
              }`}
          >
              <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
              />
          </button>
          <span className="ml-2">{isActive ? 'Ativo' : 'Inativo'}</span>
      </div>
  );
};
BenefitToggle.displayName = "BenefitToggle";
