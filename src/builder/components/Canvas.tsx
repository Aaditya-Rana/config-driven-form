import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FieldDef } from '../types';
import { SortableField } from './SortableField';
import { JSONSchema } from '../../types/schema';
import { FormSettings } from '../useFormBuilder';

interface CanvasProps {
  fields: FieldDef[];
  schema?: JSONSchema;
  formSettings?: FormSettings;
  globalColumns: 1 | 2 | 3 | 4;
  theme?: any;
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
  onDuplicateField: (field: FieldDef) => void;
  onEditField: (id: string) => void;
  onUpdateColumnSpan: (id: string, span: number) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  fields,
  schema,
  formSettings,
  globalColumns,
  theme,
  selectedFieldId,
  onSelectField,
  onRemoveField,
  onDuplicateField,
  onEditField,
  onUpdateColumnSpan,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'Canvas',
    },
  });

  const themeStyles = theme
    ? ({
        '--cdf-primary': theme.primary,
        '--cdf-bg': theme.background,
        '--cdf-text': theme.text,
        '--cdf-error': theme.error,
        '--cdf-surface': theme.surface,
        '--cdf-border': theme.border,
        '--cdf-radius': theme.radius,
      } as React.CSSProperties)
    : {};

  return (
    <div
      style={{
        flex: 1,
        padding: '2rem',
        backgroundColor: '#f3f4f6',
        overflowY: 'auto',
      }}
      onClick={() => onSelectField('')} // Click outside to deselect
    >
      <div
        className={fields.length > 0 ? 'cdf-form-container' : ''}
        ref={setNodeRef}
        style={{
          ...themeStyles,
          margin: '0 auto',
          height: 'fit-content',
          width: '100%',
          maxWidth: formSettings?.maxWidth || '800px',
          minHeight: '400px',
          backgroundColor: fields.length === 0 ? 'transparent' : 'var(--cdf-bg, white)',
          border:
            fields.length === 0 ? '2px dashed #d1d5db' : '1px solid var(--cdf-border, #e5e7eb)',
          borderRadius: 'var(--cdf-radius, 0.75rem)',
          padding: fields.length === 0 ? '0' : '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow:
            fields.length === 0 ? 'none' : 'var(--cdf-shadow, 0 10px 15px -3px rgba(0, 0, 0, 0.1))',
          transition: 'all 0.2s ease',
          ...(isOver && fields.length === 0
            ? { backgroundColor: '#eef2ff', borderColor: '#6366f1' }
            : {}),
        }}
      >
        {schema?.title && (
          <h2 className={`cdf-form-title ${formSettings?.classNames?.title || ''}`}>
            {schema.title}
          </h2>
        )}
        {schema?.description && (
          <p
            className={formSettings?.classNames?.description || ''}
            style={{ color: 'var(--cdf-text-muted)', marginBottom: '1.5rem' }}
          >
            {schema.description}
          </p>
        )}

        {fields.length === 0 ? (
          <div style={{ margin: 'auto', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '1.125rem', fontWeight: 500, marginBottom: '0.5rem' }}>
              Your form is empty
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              Drag and drop a field from the left panel to get started.
            </p>
          </div>
        ) : (
          <div className={`cdf-form-grid-${globalColumns}`} style={{ gap: '1rem' }}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  globalColumns={globalColumns}
                  isSelected={selectedFieldId === field.id}
                  onClick={() => onSelectField(field.id)}
                  onRemove={() => onRemoveField(field.id)}
                  onDuplicate={() => onDuplicateField(field)}
                  onEdit={() => onEditField(field.id)}
                  onUpdateColumnSpan={(span) => onUpdateColumnSpan(field.id, span)}
                />
              ))}
            </SortableContext>
          </div>
        )}

        {fields.length > 0 && formSettings && (
          <div
            style={{
              display: 'flex',
              marginTop: '1.25rem',
              justifyContent:
                formSettings.submitButtonAlign === 'left'
                  ? 'flex-start'
                  : formSettings.submitButtonAlign === 'right'
                    ? 'flex-end'
                    : formSettings.submitButtonAlign === 'center'
                      ? 'center'
                      : 'stretch',
              width: '100%',
            }}
          >
            <button
              type="button"
              className="cdf-submit-btn"
              style={
                formSettings.submitButtonAlign !== 'full'
                  ? { width: 'auto', minWidth: '150px' }
                  : undefined
              }
            >
              {formSettings.submitButtonText || 'Submit'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
