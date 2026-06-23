import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FieldDef } from '../types';
import { SortableField } from './SortableField';

interface CanvasProps {
  fields: FieldDef[];
  selectedFieldId: string | null;
  onSelectField: (id: string) => void;
  onRemoveField: (id: string) => void;
  onDuplicateField: (field: FieldDef) => void;
}

export const Canvas: React.FC<CanvasProps> = ({
  fields,
  selectedFieldId,
  onSelectField,
  onRemoveField,
  onDuplicateField,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
    data: {
      type: 'Canvas',
    },
  });

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
        ref={setNodeRef}
        style={{
          margin: '0 auto',
          height: 'fit-content',
          width: '100%',
          maxWidth: '800px',
          minHeight: '400px',
          backgroundColor: fields.length === 0 ? 'transparent' : 'white',
          border: fields.length === 0 ? '2px dashed #d1d5db' : '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: fields.length === 0 ? '0' : '2rem',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: fields.length === 0 ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease',
          ...(isOver && fields.length === 0
            ? { backgroundColor: '#eef2ff', borderColor: '#6366f1' }
            : {}),
        }}
      >
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            <SortableContext items={fields.map((f) => f.id)} strategy={verticalListSortingStrategy}>
              {fields.map((field) => (
                <SortableField
                  key={field.id}
                  field={field}
                  isSelected={selectedFieldId === field.id}
                  onClick={() => onSelectField(field.id)}
                  onRemove={() => onRemoveField(field.id)}
                  onDuplicate={() => onDuplicateField(field)}
                />
              ))}
            </SortableContext>
          </div>
        )}
      </div>
    </div>
  );
};
