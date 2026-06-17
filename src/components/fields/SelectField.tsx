import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';

interface SelectFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const SelectField: React.FC<SelectFieldProps> = ({ name, schema, isRequired }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  return (
    <div className="cdf-field-group">
      <label htmlFor={name} className="cdf-label">
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>

      <div className="cdf-input-wrapper">
        <select
          id={name}
          {...register(name)}
          className={`cdf-input cdf-select ${error ? 'cdf-input--error' : ''}`}
        >
          <option value="">Select an option...</option>
          {schema.enum?.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <span className="cdf-error-message">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error.message as string}
        </span>
      )}
    </div>
  );
};
