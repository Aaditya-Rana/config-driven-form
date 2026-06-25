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
  AlignJustify,
  Calendar,
  CalendarClock,
  Clock,
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
  { type: 'textarea', label: 'Long Text', icon: <AlignJustify size={18} /> },
  { type: 'date', label: 'Date', icon: <Calendar size={18} /> },
  { type: 'datetime', label: 'Date & Time', icon: <CalendarClock size={18} /> },
  { type: 'time', label: 'Time', icon: <Clock size={18} /> },
];

const DraggableTool: React.FC<{
  type: BuilderFieldType;
  label: string;
  icon: React.ReactNode;
  onAddField: (type: BuilderFieldType) => void;
}> = ({ type, label, icon, onAddField }) => {
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
      onClick={() => onAddField(type)}
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
      className="cdf-toolbox-item"
    >
      <div style={{ color: '#6366f1' }}>{icon}</div>
      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#374151' }}>{label}</span>
    </div>
  );
};

export const Toolbox: React.FC<{ onAddField: (type: BuilderFieldType) => void }> = ({
  onAddField,
}) => {
  return (
    <div className="cdf-toolbox">
      <div className="cdf-toolbox-inner">
        <div>
          <h3 className="cdf-toolbox-group-title">Form Elements</h3>
          <div className="cdf-toolbox-items">
            {TOOLS.map((tool) => (
              <DraggableTool
                key={tool.type}
                type={tool.type as BuilderFieldType}
                label={tool.label}
                icon={tool.icon}
                onAddField={onAddField}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
