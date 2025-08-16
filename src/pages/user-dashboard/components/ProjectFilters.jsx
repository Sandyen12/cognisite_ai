import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const ProjectFilters = ({ 
  onSearch, 
  onStatusFilter, 
  onDateFilter, 
  onSortChange,
  activeFilters = {},
  onClearFilters 
}) => {
  const [searchTerm, setSearchTerm] = useState(activeFilters?.search || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'failed', label: 'Failed' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'status', label: 'By Status' }
  ];

  const handleSearchChange = (e) => {
    const value = e?.target?.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleStatusChange = (value) => {
    onStatusFilter(value);
  };

  const handleSortChange = (value) => {
    onSortChange(value);
  };

  const handleDateRangeChange = (range) => {
    onDateFilter(range);
    setShowDatePicker(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters?.search) count++;
    if (activeFilters?.status && activeFilters?.status !== 'all') count++;
    if (activeFilters?.dateRange) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
            <Input
              type="search"
              placeholder="Search projects by name or URL..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          {/* Status Filter */}
          <Select
            options={statusOptions}
            value={activeFilters?.status || 'all'}
            onChange={handleStatusChange}
            placeholder="Filter by status"
            className="min-w-[140px]"
          />

          {/* Date Range Filter */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDatePicker(!showDatePicker)}
              iconName="Calendar"
              iconPosition="left"
              iconSize={16}
            >
              {activeFilters?.dateRange ? 'Custom Range' : 'All Dates'}
            </Button>

            {showDatePicker && (
              <>
                <div 
                  className="fixed inset-0 z-20" 
                  onClick={() => setShowDatePicker(false)}
                />
                <div className="absolute right-0 top-10 w-64 bg-popover border border-border rounded-md shadow-lg z-30 p-4 animate-slide-down">
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm">Filter by Date</h4>
                    <div className="space-y-2">
                      <button
                        onClick={() => handleDateRangeChange('today')}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                      >
                        Today
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('week')}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                      >
                        This Week
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('month')}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                      >
                        This Month
                      </button>
                      <button
                        onClick={() => handleDateRangeChange('quarter')}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-muted rounded"
                      >
                        Last 3 Months
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sort Options */}
          <Select
            options={sortOptions}
            value={activeFilters?.sort || 'newest'}
            onChange={handleSortChange}
            placeholder="Sort by"
            className="min-w-[140px]"
          />

          {/* Clear Filters */}
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
              iconSize={16}
            >
              Clear ({activeFilterCount})
            </Button>
          )}
        </div>
      </div>
      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          
          {activeFilters?.search && (
            <div className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
              <Icon name="Search" size={12} className="mr-1" />
              Search: "{activeFilters?.search}"
              <button
                onClick={() => {
                  setSearchTerm('');
                  onSearch('');
                }}
                className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {activeFilters?.status && activeFilters?.status !== 'all' && (
            <div className="inline-flex items-center px-2 py-1 bg-accent/10 text-accent rounded-full text-xs">
              <Icon name="Filter" size={12} className="mr-1" />
              Status: {activeFilters?.status}
              <button
                onClick={() => onStatusFilter('all')}
                className="ml-1 hover:bg-accent/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}

          {activeFilters?.dateRange && (
            <div className="inline-flex items-center px-2 py-1 bg-warning/10 text-warning rounded-full text-xs">
              <Icon name="Calendar" size={12} className="mr-1" />
              Date: {activeFilters?.dateRange}
              <button
                onClick={() => onDateFilter(null)}
                className="ml-1 hover:bg-warning/20 rounded-full p-0.5"
              >
                <Icon name="X" size={10} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;