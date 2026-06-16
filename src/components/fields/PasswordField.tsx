import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema } from '../../types/schema';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

interface PasswordFieldProps {
  name: string;
  schema: JSONSchema;
  isRequired?: boolean;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ name, schema, isRequired }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);
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
          type={showPassword ? 'text' : 'password'}
          className={`cdf-input ${error ? 'cdf-input--error' : ''}`}
          style={{ paddingRight: '2.5rem' }}
          placeholder={`Enter ${schema.title || name}`}
          {...register(name)}
        />
        <button
          type="button"
          className="cdf-toolbar-btn"
          style={{ position: 'absolute', right: '0.5rem' }}
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
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
