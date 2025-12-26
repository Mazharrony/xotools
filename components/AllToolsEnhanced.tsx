'use client';

import { useState, useMemo } from 'react';
import { tools, categories, getIcon, Tool } from '@/lib/tools-data';
import ToolCard from './ToolCard';

type SortOption = 'popular' | 'new' | 'name';
type CategoryFilter = 'all' | Tool['category'];

export default function AllToolsEnhanced() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('popular');

  // Filter and sort tools
  const filteredAndSortedTools = useMemo(() => {
    let filtered = tools;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        tool =>
          tool.title.toLowerCase().includes(query) ||
          tool.description.toLowerCase().includes(query) ||
          tool.category.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Sort tools
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'popular':
          // Define popular tools (you can customize this list)
          const popularIds = ['qr-code-generator', 'barcode-generator', 'image-compressor', 'merge-pdf'];
          const aPopular = popularIds.includes(a.id);
          const bPopular = popularIds.includes(b.id);
          if (aPopular && !bPopular) return -1;
          if (!aPopular && bPopular) return 1;
          return a.title.localeCompare(b.title);
        case 'new':
          // New tools (you can customize this list)
          const newIds = ['word-counter', 'case-converter', 'json-formatter', 'vat-calculator'];
          const aNew = newIds.includes(a.id);
          const bNew = newIds.includes(b.id);
          if (aNew && !bNew) return -1;
          if (!aNew && bNew) return 1;
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, selectedCategory, sortBy]);

  const getCategoryTag = (category: Tool['category']) => {
    const tagMap: Record<string, string> = {
      image: 'Image',
      pdf: 'PDF',
      text: 'Text',
      generator: 'Generator',
      developer: 'Dev',
      calculator: 'Calculator',
    };
    return tagMap[category] || category;
  };

  const getBadge = (tool: Tool) => {
    const newTools = ['word-counter', 'case-converter', 'json-formatter', 'vat-calculator'];
    if (newTools.includes(tool.id)) return 'NEW';
    return undefined;
  };

  return (
    <div className="bg-[#F8FAFC] dark:bg-[#111827] py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0F172A] dark:text-[#E5E7EB] mb-4">
            All Tools
          </h1>
          <p className="text-lg text-[#475569] dark:text-[#64748B] max-w-2xl mx-auto">
            Discover all our free online tools - search, filter, and find exactly what you need
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools..."
              className="w-full pl-12 pr-4 py-3 border border-[#E5E7EB] dark:border-gray-700 rounded-xl bg-white dark:bg-[#111827] text-[#0F172A] dark:text-[#E5E7EB] placeholder-gray-400 focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all"
            />
          </div>

          {/* Category Filters and Sort */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-white dark:bg-[#111827] text-[#475569] dark:text-[#64748B] border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2563EB] dark:hover:border-[#3B82F6]'
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as CategoryFilter)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-white dark:bg-[#111827] text-[#475569] dark:text-[#64748B] border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2563EB] dark:hover:border-[#3B82F6]'
                  }`}
                >
                  <span className="text-[#2563EB] dark:text-[#3B82F6]">{getIcon(category.icon)}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="ml-auto">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-[#111827] text-[#475569] dark:text-[#64748B] border border-[#E5E7EB] dark:border-gray-700 hover:border-[#2563EB] dark:hover:border-[#3B82F6] focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] transition-all cursor-pointer"
              >
                <option value="popular">Sort: Popular</option>
                <option value="new">Sort: New</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="text-sm text-[#475569] dark:text-[#64748B]">
            Showing {filteredAndSortedTools.length} tool{filteredAndSortedTools.length !== 1 ? 's' : ''}
            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </div>
        </div>

        {/* Tools Grid */}
        {filteredAndSortedTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredAndSortedTools.map((tool) => (
              <ToolCard
                key={tool.id}
                icon={getIcon(tool.icon)}
                title={tool.title}
                description={tool.description}
                href={tool.href}
                badge={getBadge(tool)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-lg text-[#475569] dark:text-[#64748B] mb-2">No tools found</p>
            <p className="text-sm text-[#64748B] dark:text-[#64748B]">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

