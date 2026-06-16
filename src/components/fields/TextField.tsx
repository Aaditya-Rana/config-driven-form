import React from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';
import { AlertCircle } from 'lucide-react';

interface TextFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const TextField: React.FC<TextFieldProps> = ({ name, schema, isRequired }) => {
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
          type={schema.format === 'email' ? 'email' : 'text'}
          className={`cdf-input ${error ? 'cdf-input--error' : ''}`}
          placeholder={`Enter ${schema.title || name}`}
          {...register(name)}
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
