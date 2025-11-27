import React from 'react';
import {
  Box,
  Drawer,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import { Close, Refresh } from '@mui/icons-material';

const FilterSidebar = ({
  open,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  categories,
  sizes,
  conditions,
  sortOptions,
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 400 }, p: 3 },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          Filters
        </Typography>
        <IconButton onClick={onClose} edge="end">
          <Close />
        </IconButton>
      </Box>

      <Stack spacing={3} sx={{ flex: 1, overflowY: 'auto', pb: 10 }}>
        {/* Sort By */}
        <FormControl fullWidth>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Category Filter */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category}
            label="Category"
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Size Filter */}
        <FormControl fullWidth>
          <InputLabel>Size</InputLabel>
          <Select
            value={filters.size}
            label="Size"
            onChange={(e) => onFilterChange('size', e.target.value)}
          >
            {sizes.map((size) => (
              <MenuItem key={size} value={size}>
                {size === 'all' ? 'All Sizes' : size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Condition Filter */}
        <FormControl fullWidth>
          <InputLabel>Condition</InputLabel>
          <Select
            value={filters.condition}
            label="Condition"
            onChange={(e) => onFilterChange('condition', e.target.value)}
          >
            {conditions.map((cond) => (
              <MenuItem key={cond} value={cond}>
                {cond === 'all' ? 'All Conditions' : cond}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider />

        {/* Points Range */}
        <Box>
          <Typography variant="subtitle2" gutterBottom fontWeight="bold">
            Points Range
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Min"
              type="number"
              size="small"
              value={filters.minPoints}
              onChange={(e) => onFilterChange('minPoints', e.target.value)}
              inputProps={{ min: 1, max: 1000 }}
            />
            <TextField
              label="Max"
              type="number"
              size="small"
              value={filters.maxPoints}
              onChange={(e) => onFilterChange('maxPoints', e.target.value)}
              inputProps={{ min: 1, max: 1000 }}
            />
          </Box>
        </Box>

        {/* Additional Filters */}
        <TextField
          label="Color"
          value={filters.color}
          onChange={(e) => onFilterChange('color', e.target.value)}
          placeholder="e.g., blue, red"
          size="small"
        />

        <TextField
          label="Brand"
          value={filters.brand}
          onChange={(e) => onFilterChange('brand', e.target.value)}
          placeholder="e.g., Nike, Zara"
          size="small"
        />

        <TextField
          label="Location"
          value={filters.location}
          onChange={(e) => onFilterChange('location', e.target.value)}
          placeholder="City or State"
          size="small"
        />
      </Stack>

      {/* Footer Actions */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          p: 3,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
        }}
      >
        <Button variant="outlined" onClick={onClearFilters} startIcon={<Refresh />} fullWidth>
          Reset
        </Button>
        <Button variant="contained" onClick={onClose} fullWidth>
          Show Results
        </Button>
      </Box>
    </Drawer>
  );
};

export default FilterSidebar;
