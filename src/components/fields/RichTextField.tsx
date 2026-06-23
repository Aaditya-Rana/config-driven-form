import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { JSONSchema, UISchema } from '../../types/schema';
import { useClassNames, cx } from '../ClassNamesContext';
import { AlertCircle, Bold, Italic, List, ListOrdered, Heading2 } from 'lucide-react';

interface RichTextFieldProps {
  name: string;
  schema: JSONSchema;
  uiSchema?: UISchema;
  isRequired?: boolean;
}

export const RichTextField: React.FC<RichTextFieldProps> = ({
  name,
  schema,
  uiSchema,
  isRequired,
}) => {
  const globalClasses = useClassNames();
  const localClasses = uiSchema?.['ui:classNames'] || {};
  const {
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();
  const error = errors[name];
  const value = watch(name);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value || '',
    onUpdate: ({ editor }) => {
      setValue(name, editor.getHTML(), { shouldValidate: true, shouldDirty: true });
    },
  });

  // Keep editor in sync with external form changes (if any)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  return (
    <div className={cx('cdf-field-group', globalClasses.fieldGroup, localClasses.fieldGroup)}>
      <label className={cx('cdf-label', globalClasses.label, localClasses.label)} htmlFor={name}>
        {schema.title || name}
        {isRequired && <span className="cdf-required-mark">*</span>}
      </label>
      {schema.description && (
        <p
          className={cx('cdf-description', globalClasses.description, localClasses.description)}
          style={{ fontSize: '0.875rem', color: '#6b7280', margin: '-0.25rem 0 0.5rem 0' }}
        >
          {schema.description}
        </p>
      )}

      <div
        className={cx(
          'cdf-rich-text-wrapper',
          error && 'cdf-input--error',
          error && globalClasses.inputError,
          error && localClasses.inputError,
        )}
      >
        <div className="cdf-rich-text-toolbar">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`cdf-toolbar-btn ${editor?.isActive('bold') ? 'is-active' : ''}`}
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`cdf-toolbar-btn ${editor?.isActive('italic') ? 'is-active' : ''}`}
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`cdf-toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'is-active' : ''}`}
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`cdf-toolbar-btn ${editor?.isActive('bulletList') ? 'is-active' : ''}`}
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            className={`cdf-toolbar-btn ${editor?.isActive('orderedList') ? 'is-active' : ''}`}
          >
            <ListOrdered size={16} />
          </button>
        </div>

        <EditorContent editor={editor} className="cdf-rich-text-content" />
      </div>

      {error && (
        <span className={cx('cdf-error-message', globalClasses.errorText, localClasses.errorText)}>
          <AlertCircle size={14} />
          {error.message as string}
        </span>
      )}
    </div>
  );
};
