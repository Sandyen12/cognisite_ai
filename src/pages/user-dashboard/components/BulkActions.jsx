import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedProjects, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport,
  totalProjects,
  isAllSelected 
}) => {
  const selectedCount = selectedProjects?.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      onDeselectAll();
    } else {
      onSelectAll();
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6 animate-slide-down">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 bg-primary rounded border-2 border-primary flex items-center justify-center">
              <Icon name="Check" size={12} color="white" />
            </div>
            <span className="text-sm font-medium text-foreground">
              {selectedCount} of {totalProjects} projects selected
            </span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-primary hover:text-primary/80"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkExport}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export ({selectedCount})
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            iconName="Trash2"
            iconPosition="left"
            iconSize={16}
            className="text-error border-error/30 hover:bg-error/10"
          >
            Delete ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;