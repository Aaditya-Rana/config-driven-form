import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldDef } from '../types';
import { FieldRenderer } from '../../components/FieldRenderer';
import { GripVertical, Trash2, Copy } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

interface SortableFieldProps {
  field: FieldDef;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export const SortableField: React.FC<SortableFieldProps> = ({
  field,
  isSelected,
  onClick,
  onRemove,
  onDuplicate,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.id,
    data: {
      type: 'SortableField',
      field,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    position: 'relative' as const,
    zIndex: isDragging ? 10 : 1,
    padding: '2rem 1.5rem 1.5rem', // Extra top padding for drag handle
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    border: `2px solid ${isSelected ? '#6366f1' : '#e5e7eb'}`,
    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
    marginBottom: '1rem',
    cursor: 'pointer',
    gridColumn: `span ${field.uiSchema?.['ui:columnSpan'] || 1} / span ${field.uiSchema?.['ui:columnSpan'] || 1}`,
  };

  // We need a dummy FormProvider to render the fields live without throwing errors
  const methods = useForm();

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        style={{
          position: 'absolute',
          top: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '24px',
          backgroundColor: isSelected ? '#eef2ff' : '#f3f4f6',
          borderBottomLeftRadius: '8px',
          borderBottomRightRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: isSelected ? '#6366f1' : '#9ca3af',
          zIndex: 2,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent selecting field when clicking handle
      >
        <GripVertical size={16} />
      </div>

      {/* Field Renderer (Live Preview) */}
      <div style={{ position: 'relative' }}>
        {/* Invisible Glass Overlay to prevent clicking/typing into the field while in editor mode */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, cursor: 'pointer' }} />

        <div style={{ pointerEvents: 'none' }}>
          <FormProvider {...methods}>
            <form>
              <FieldRenderer
                name={field.key}
                schema={field.schema}
                uiSchema={field.uiSchema}
                isRequired={field.isRequired}
              />
            </form>
          </FormProvider>
        </div>
      </div>

      {/* Action Buttons */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '-12px',
            right: '1rem',
            display: 'flex',
            gap: '0.25rem',
            backgroundColor: '#ffffff',
            border: '1px solid #e5e7eb',
            padding: '0.25rem',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            zIndex: 10,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            style={{
              color: '#4f46e5',
              backgroundColor: '#eef2ff',
              border: 'none',
              cursor: 'pointer',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Duplicate Field"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            style={{
              color: '#ef4444',
              backgroundColor: '#fef2f2',
              border: 'none',
              cursor: 'pointer',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Remove Field"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
