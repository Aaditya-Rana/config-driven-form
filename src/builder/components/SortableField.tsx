import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FieldDef } from '../types';
import { FieldRenderer } from '../../components/FieldRenderer';
import { GripVertical, Trash2, Copy, Settings, Columns2 } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';

interface SortableFieldProps {
  field: FieldDef;
  globalColumns: 1 | 2 | 3 | 4;
  isSelected: boolean;
  onClick: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onUpdateColumnSpan: (span: number) => void;
  stepIndex?: number;
}

export const SortableField: React.FC<SortableFieldProps> = ({
  field,
  globalColumns,
  isSelected,
  onClick,
  onRemove,
  onDuplicate,
  onEdit,
  onUpdateColumnSpan,
  stepIndex,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  // Resize State
  const [resizeSpan, setResizeSpan] = React.useState<number | null>(null);
  const dragStartX = React.useRef<number | null>(null);
  const initialSpan = React.useRef<number | null>(null);

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    dragStartX.current = e.clientX;
    initialSpan.current = Math.min(field.uiSchema?.['ui:columnSpan'] || 1, globalColumns);
    setResizeSpan(initialSpan.current);

    const onMouseMove = (moveEvent: MouseEvent) => {
      if (dragStartX.current === null || initialSpan.current === null) return;
      const deltaX = moveEvent.clientX - dragStartX.current;

      // Sensitivity: roughly 120px per column
      const columnDelta = Math.round(deltaX / 120);

      let newSpan = initialSpan.current + columnDelta;
      newSpan = Math.max(1, Math.min(newSpan, globalColumns));

      setResizeSpan(newSpan);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);

      setResizeSpan((currentResizeSpan) => {
        if (currentResizeSpan !== null && currentResizeSpan !== initialSpan.current) {
          onUpdateColumnSpan(currentResizeSpan);
        }
        return null;
      });
      dragStartX.current = null;
      initialSpan.current = null;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };
  const showActions = isSelected || isHovered;

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
    padding: '1.5rem 1rem 1rem', // Smaller padding for parity with real form
    backgroundColor: isHovered || isSelected ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
    borderRadius: '0.75rem',
    border: `2px solid ${isSelected ? '#6366f1' : isHovered ? '#e5e7eb' : 'transparent'}`,
    boxShadow: isSelected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none',
    marginBottom: '0',
    cursor: 'pointer',
  };

  const configuredSpan = field.uiSchema?.['ui:columnSpan'] || 1;
  const baseSpan = Math.min(configuredSpan, globalColumns);
  const span = resizeSpan !== null ? resizeSpan : baseSpan;

  // We need a dummy FormProvider to render the fields live without throwing errors
  const methods = useForm();

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`cdf-builder-field-span-${span}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
          display: isHovered || isSelected || isDragging ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          color: isSelected ? '#6366f1' : '#9ca3af',
          zIndex: 2,
          opacity: isHovered || isSelected ? 1 : 0,
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
          {field.type === 'step' ? (
            <div
              style={{
                padding: '1rem',
                textAlign: 'center',
                border: '2px dashed #d1d5db',
                borderRadius: '0.5rem',
                color: '#6b7280',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                backgroundColor: '#f9fafb',
              }}
            >
              Step {stepIndex} Break
            </div>
          ) : (
            <FormProvider {...methods}>
              <form>
                <FieldRenderer
                  name={field.key}
                  schema={field.schema}
                  uiSchema={field.uiSchema}
                  isRequired={field.isRequired}
                  isBuilder={true}
                />
              </form>
            </FormProvider>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {showActions && (
        <div
          style={{
            position: 'absolute',
            bottom: '-16px',
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
          {globalColumns > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                const nextSpan = span < globalColumns ? span + 1 : 1;
                onUpdateColumnSpan(nextSpan);
              }}
              style={{
                color: '#4b5563',
                backgroundColor: '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                padding: '0.375rem',
                borderRadius: '0.375rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Toggle Column Span"
            >
              <Columns2 size={14} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              color: '#4b5563',
              backgroundColor: '#f3f4f6',
              border: 'none',
              cursor: 'pointer',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Edit Field Properties"
          >
            <Settings size={14} />
          </button>
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

      {/* Resize Handle */}
      {globalColumns > 1 && (isHovered || isSelected || resizeSpan !== null) && (
        <div
          onMouseDown={handleResizeStart}
          style={{
            position: 'absolute',
            top: '50%',
            right: '-1px',
            transform: 'translate(50%, -50%)',
            width: '16px',
            height: '32px',
            backgroundColor: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            cursor: 'col-resize',
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          }}
          title="Drag to resize width"
        >
          <div
            style={{
              width: '2px',
              height: '16px',
              backgroundColor: '#9ca3af',
              borderRadius: '1px',
              marginRight: '2px',
            }}
          />
          <div
            style={{
              width: '2px',
              height: '16px',
              backgroundColor: '#9ca3af',
              borderRadius: '1px',
            }}
          />
        </div>
      )}
    </div>
  );
};
