import React, { useState } from 'react';

interface FilterModalProps {
  onFilterChange: (filters: Filters) => void;
}

interface Filters {
  minPrice: number;
  maxPrice: number;
  minDate: string;
  maxDate: string;
  category: string;
}

const FilterModal: React.FC<FilterModalProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<Filters>({
    minPrice: 0,
    maxPrice: 1000,
    minDate: '',
    maxDate: '',
    category: 'all',
  });

  const handleFilterChange = () => {
    onFilterChange(filters);
  };

  return (
    <div className="filter-window">
      <div>
        <label>Минимальная стоимость:</label>
        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: +e.target.value })}
        />
      </div>
      <div>
        <label>Максимальная стоимость:</label>
        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: +e.target.value })}
        />
      </div>
      <div>
        <label>Минимальная дата:</label>
        <input
          type="date"
          value={filters.minDate}
          onChange={(e) => setFilters({ ...filters, minDate: e.target.value })}
        />
      </div>
      <div>
        <label>Максимальная дата:</label>
        <input
          type="date"
          value={filters.maxDate}
          onChange={(e) => setFilters({ ...filters, maxDate: e.target.value })}
        />
      </div>
      <div>
        <label>Категория:</label>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        >
          <option value="all">Все</option>
          <option value="category1">Категория 1</option>
          <option value="category2">Категория 2</option>
          <option value="category3">Категория 3</option>
        </select>
      </div>
      <button onClick={handleFilterChange}>Применить фильтры</button>
    </div>
  );
};

export default FilterModal;
