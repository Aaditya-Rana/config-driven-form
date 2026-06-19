import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';

interface FileFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const FileField: React.FC<FileFieldProps> = ({ name, schema, uiSchema, isRequired }) => {
  const globalClasses = useClassNames();
  const localClasses = uiSchema?.['ui:classNames'] || {};
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const [fileName, setFileName] = useState<string | null>(null);
  const error = errors[name];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue(name, undefined, { shouldValidate: true });
      setFileName(null);
      return;
    }

    setFileName(file.name);

    // Convert file to base64 data-url
    const reader = new FileReader();
    reader.onload = (event) => {
      setValue(name, event.target?.result, { shouldValidate: true });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label className={cx('cdf-label', globalClasses.label, localClasses.label)}>
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>

      <div
        className={cx(
          'cdf-file-wrapper',
          globalClasses.fileWrapper,
          localClasses.fileWrapper,
          error && 'cdf-input--error',
          error && globalClasses.inputError,
          error && localClasses.inputError,
        )}
      >
        <input type="file" className="cdf-file-input" onChange={handleFileChange} />
        <div className={cx('cdf-file-text', globalClasses.fileText, localClasses.fileText)}>
          <span>Click to upload</span> or drag and drop
        </div>
        {fileName && (
          <div className="cdf-file-preview">
            Selected: <strong>{fileName}</strong>
          </div>
        )}
      </div>

      {error && (
        <span className={cx('cdf-error-message', globalClasses.errorText, localClasses.errorText)}>
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
