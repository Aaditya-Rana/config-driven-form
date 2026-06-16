import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';
import { AlertCircle } from 'lucide-react';

interface NumberFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const NumberField: React.FC<NumberFieldProps> = ({ name, schema, isRequired }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];

  return (
    <div className="cdf-field-group">
      <label className="cdf-label" htmlFor={name}>
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>
      <div className="cdf-input-wrapper">
        <input
          id={name}
          type="number"
          className={`cdf-input ${error ? 'cdf-input--error' : ''}`}
          placeholder={`Enter ${schema.title || name}`}
          {...register(name, {
            valueAsNumber: true,
          })}
        />
      </div>
      {error && (
        <span className="cdf-error-message">
          <AlertCircle size={14} />
          {error.message as string}
        </span>
      )}
    </div>
  );
};
