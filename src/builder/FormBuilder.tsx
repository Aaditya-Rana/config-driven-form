import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { JSONSchema, UISchema } from '../types/schema';
import { useFormBuilder, FormSettings } from './useFormBuilder';
import { Toolbox } from './components/Toolbox';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/PropertiesPanel';
import { BuilderFieldType } from './types';
import { Save, Code2, Eye, LayoutTemplate, Settings } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { SchemaForm } from '../components/SchemaForm';
import { FieldRenderer } from '../components/FieldRenderer';
import '../styles/form.css'; // Ensure base form styles are loaded for canvas

export interface FormBuilderProps {
  initialSchema?: JSONSchema;
  initialUiSchema?: Record<string, UISchema>;
  initialColumns?: 1 | 2 | 3 | 4;
  initialTheme?: FormSettings['theme'];
  onSave?: (
    schema: JSONSchema,
    uiSchema: Record<string, UISchema>,
    formSettings: FormSettings,
  ) => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({
  initialSchema,
  initialUiSchema,
  initialColumns,
  initialTheme,
  onSave,
}) => {
  const {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    selectedField,
    addField,
    removeField,
    updateField,
    reorderFields,
    compileSchemas,
    formSettings,
    updateFormSettings,
  } = useFormBuilder(initialSchema, initialUiSchema, initialColumns, initialTheme);

  const [activeDragType, setActiveDragType] = useState<BuilderFieldType | null>(null);
  const [activeSortableField, setActiveSortableField] = useState<any | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isPropertiesDialogOpen, setIsPropertiesDialogOpen] = useState(false);

  // Dummy form methods for the drag overlay
  const methods = useForm();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'ToolboxItem') {
      setActiveDragType(active.data.current.fieldType);
    } else if (active.data.current?.type === 'SortableField') {
      setActiveSortableField(active.data.current.field);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragType(null);
    setActiveSortableField(null);

    if (!over) return;

    if (active.data.current?.type === 'ToolboxItem') {
      // Dropping a new field from the toolbox onto the canvas
      if (over.id === 'canvas-droppable' || fields.find((f) => f.id === over.id)) {
        // If dropped on an existing item, insert at that index. Otherwise append.
        const overIndex = fields.findIndex((f) => f.id === over.id);
        addField(
          active.data.current.fieldType as BuilderFieldType,
          overIndex >= 0 ? overIndex : undefined,
        );
      }
      return;
    }

    if (active.data.current?.type === 'SortableField' && active.id !== over.id) {
      // Reordering fields within the canvas
      reorderFields(active.id as string, over.id as string);
    }
  };

  const handleSave = () => {
    if (onSave) {
      const { schema, uiSchema } = compileSchemas();
      onSave(schema, uiSchema, formSettings);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      {/* Top Bar */}
      <div className="cdf-builder-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#6366f1',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <Code2 size={20} />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#111827', margin: 0 }}>
            Visual Form Builder
          </h1>
        </div>

        {/* Mode Toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#f3f4f6',
            padding: '0.25rem',
            borderRadius: '0.5rem',
          }}
        >
          <button
            onClick={() => setIsPreviewMode(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: !isPreviewMode ? 'white' : 'transparent',
              color: !isPreviewMode ? '#111827' : '#6b7280',
              boxShadow: !isPreviewMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <LayoutTemplate size={16} /> Builder
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              padding: '0.375rem 0.75rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
              backgroundColor: isPreviewMode ? 'white' : 'transparent',
              color: isPreviewMode ? '#111827' : '#6b7280',
              boxShadow: isPreviewMode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            <Eye size={16} /> Preview
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="cdf-topbar-action"
            onClick={() => {
              setSelectedFieldId(null);
              setIsPropertiesDialogOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'white',
              color: '#374151',
              border: '1px solid #d1d5db',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9fafb')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
          >
            <Settings size={16} /> <span>Global Settings</span>
          </button>
          <button
            className="cdf-topbar-action"
            onClick={handleSave}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#4f46e5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6366f1')}
          >
            <Save size={16} /> <span>Save Form</span>
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="cdf-builder-main">
        {isPreviewMode ? (
          <div
            style={{
              flex: 1,
              padding: '3rem',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                margin: '0 auto',
                height: 'fit-content',
                width: '100%',
                maxWidth: formSettings.maxWidth || '800px',
                minHeight: '400px',
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '1rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              }}
            >
              <div
                style={{
                  marginBottom: '2rem',
                  paddingBottom: '1rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#6366f1',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Live Preview
                </span>
              </div>
              <SchemaForm
                schema={compileSchemas().schema}
                uiSchema={compileSchemas().uiSchema}
                columns={formSettings.columns}
                theme={formSettings.theme}
                classNames={formSettings.classNames}
                submitButtonText={formSettings.submitButtonText}
                submitButtonAlign={formSettings.submitButtonAlign}
                onSubmit={(data) =>
                  alert('Preview Form Submitted!\n\n' + JSON.stringify(data, null, 2))
                }
              />
            </div>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {/* Left: Toolbox */}
            <Toolbox onAddField={(type) => addField(type, undefined)} />

            {/* Center: Canvas */}
            <Canvas
              fields={fields}
              schema={compileSchemas().schema}
              formSettings={formSettings}
              globalColumns={formSettings.columns}
              theme={formSettings.theme}
              selectedFieldId={selectedFieldId}
              onSelectField={setSelectedFieldId}
              onRemoveField={removeField}
              onDuplicateField={(f) => {
                // Add a copy of the field right after it
                const idx = fields.findIndex((field) => field.id === f.id);
                addField(f.type, idx + 1);
              }}
              onEditField={(id) => {
                setSelectedFieldId(id);
                setIsPropertiesDialogOpen(true);
              }}
              onUpdateColumnSpan={(id, span) => {
                const f = fields.find((field) => field.id === id);
                if (f) {
                  updateField(id, {
                    uiSchema: { ...(f.uiSchema || {}), 'ui:columnSpan': span },
                  });
                }
              }}
            />

            {/* Modal Dialog Properties */}
            <PropertiesPanel
              field={selectedField || null}
              formSettings={formSettings}
              isOpen={isPropertiesDialogOpen}
              onClose={() => setIsPropertiesDialogOpen(false)}
              onUpdate={updateField}
              onUpdateSettings={updateFormSettings}
            />

            {/* Drag Overlay (Visual feedback when dragging) */}
            <DragOverlay dropAnimation={null}>
              {activeDragType ? (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    borderRadius: '0.5rem',
                    opacity: 0.8,
                    fontWeight: 500,
                  }}
                >
                  Dropping {activeDragType}...
                </div>
              ) : activeSortableField ? (
                <div
                  style={{
                    padding: '1.5rem 1rem 1rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '0.75rem',
                    border: '2px solid #6366f1',
                    boxShadow:
                      '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
                    transform: 'scale(1.02)',
                    opacity: 0.9,
                    cursor: 'grabbing',
                  }}
                >
                  <FormProvider {...methods}>
                    <form>
                      <FieldRenderer
                        name={activeSortableField.key}
                        schema={activeSortableField.schema}
                        uiSchema={activeSortableField.uiSchema}
                        isRequired={activeSortableField.isRequired}
                      />
                    </form>
                  </FormProvider>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </div>
  );
};
