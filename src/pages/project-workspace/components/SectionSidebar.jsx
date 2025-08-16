import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import SectionCard from './SectionCard';

const SectionSidebar = ({ 
  sections = [], 
  activeSection = null,
  onSectionSelect = () => {},
  isCollapsed = false,
  onToggleCollapse = () => {},
  className = '' 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = sections?.filter(section =>
    section?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    section?.page?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  const getSectionStats = () => {
    const completed = sections?.filter(s => s?.status === 'completed')?.length;
    const inProgress = sections?.filter(s => s?.status === 'in-progress')?.length;
    const pending = sections?.filter(s => s?.status === 'pending')?.length;
    
    return { completed, inProgress, pending, total: sections?.length };
  };

  const stats = getSectionStats();

  if (isCollapsed) {
    return (
      <div className={`w-12 bg-card border-r border-border flex flex-col items-center py-4 ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleCollapse}
          className="mb-4"
        >
          <Icon name="PanelLeftOpen" size={20} />
        </Button>
        <div className="flex flex-col space-y-2">
          {sections?.slice(0, 5)?.map((section, index) => (
            <button
              key={section?.id}
              onClick={() => onSectionSelect(section)}
              className={`w-8 h-8 rounded flex items-center justify-center text-xs font-medium transition-colors ${
                activeSection?.id === section?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
              title={section?.name}
            >
              {index + 1}
            </button>
          ))}
          
          {sections?.length > 5 && (
            <div className="w-8 h-8 rounded flex items-center justify-center text-xs font-medium bg-muted text-muted-foreground">
              +{sections?.length - 5}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-card border-r border-border flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Website Sections</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
          >
            <Icon name="PanelLeftClose" size={20} />
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-success/10 rounded">
            <div className="text-lg font-semibold text-success">{stats?.completed}</div>
            <div className="text-xs text-muted-foreground">Done</div>
          </div>
          <div className="text-center p-2 bg-warning/10 rounded">
            <div className="text-lg font-semibold text-warning">{stats?.inProgress}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="text-center p-2 bg-muted rounded">
            <div className="text-lg font-semibold text-muted-foreground">{stats?.pending}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>
      {/* Sections List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredSections?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No sections match your search' : 'No sections found'}
            </p>
          </div>
        ) : (
          filteredSections?.map((section) => (
            <SectionCard
              key={section?.id}
              section={section}
              isActive={activeSection?.id === section?.id}
              onClick={onSectionSelect}
            />
          ))
        )}
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{filteredSections?.length} of {sections?.length} sections</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span>Completed</span>
            <div className="w-2 h-2 bg-warning rounded-full ml-2"></div>
            <span>In Progress</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionSidebar;