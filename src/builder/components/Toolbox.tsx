import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { BuilderFieldType } from '../types';
import {
  Type,
  Hash,
  Mail,
  Key,
  AlignLeft,
  FileUp,
  CheckSquare,
  List,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

const TOOLS: { type: BuilderFieldType; label: string; icon: React.ReactNode }[] = [
  { type: 'text', label: 'Text Field', icon: <Type size={18} /> },
  { type: 'number', label: 'Number', icon: <Hash size={18} /> },
  { type: 'email', label: 'Email', icon: <Mail size={18} /> },
  { type: 'password', label: 'Password', icon: <Key size={18} /> },
  { type: 'rich-text', label: 'Rich Text', icon: <AlignLeft size={18} /> },
  { type: 'select', label: 'Dropdown', icon: <ChevronDown size={18} /> },
  { type: 'radio', label: 'Radio Group', icon: <CheckCircle2 size={18} /> },
  { type: 'checkbox', label: 'Checkbox', icon: <CheckSquare size={18} /> },
  { type: 'checkboxes', label: 'Checkbox Group', icon: <List size={18} /> },
  { type: 'file', label: 'File Upload', icon: <FileUp size={18} /> },
];

const DraggableTool: React.FC<{ type: BuilderFieldType; label: string; icon: React.ReactNode }> = ({
  type,
  label,
  icon,
}) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${type}`,
    data: {
      type: 'ToolboxItem',
      fieldType: type,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.75rem',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.5rem',
        cursor: isDragging ? 'grabbing' : 'grab',
        opacity: isDragging ? 0.5 : 1,
        marginBottom: '0.5rem',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#6366f1';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 6px rgba(99, 102, 241, 0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ color: '#6b7280' }}>{icon}</div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  );
};

export const Toolbox: React.FC = () => {
  return (
    <div
      style={{
        padding: '1.5rem',
        width: '280px',
        borderRight: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
        Form Elements
      </h3>
      <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1.5rem' }}>
        Drag and drop fields onto the canvas to build your form.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {TOOLS.map((tool) => (
          <DraggableTool key={tool.type} {...tool} />
        ))}
      </div>
    </div>
  );
};
