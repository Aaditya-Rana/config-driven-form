import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';

interface CheckboxGroupFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const CheckboxGroupField: React.FC<CheckboxGroupFieldProps> = ({
  name,
  schema,
  isRequired,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  // Extract enum options from items definition
  let options: any[] = [];
  if (schema.items && !Array.isArray(schema.items) && schema.items.enum) {
    options = schema.items.enum;
  }

  return (
    <div className="cdf-field-group">
      <label className="cdf-label">
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>

      <div className="cdf-checkbox-group">
        {options.map((option) => (
          <label key={option} className="cdf-checkbox-label">
            <input
              type="checkbox"
              value={option}
              {...register(name)}
              className="cdf-checkbox-input"
            />
            {option}
          </label>
        ))}
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
