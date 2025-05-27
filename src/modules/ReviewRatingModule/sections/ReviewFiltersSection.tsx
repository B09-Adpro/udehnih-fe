import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ReviewFiltersSectionProps {
  onFilterChange: (filter: string) => void
  onSortChange: (sort: string) => void
}

export const ReviewFiltersSection = ({ onFilterChange, onSortChange }: ReviewFiltersSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <Select onValueChange={onFilterChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Filter rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Rating</SelectItem>
          <SelectItem value="5">5 Bintang</SelectItem>
          <SelectItem value="4">4 Bintang</SelectItem>
          <SelectItem value="3">3 Bintang</SelectItem>
          <SelectItem value="2">2 Bintang</SelectItem>
          <SelectItem value="1">1 Bintang</SelectItem>
        </SelectContent>
      </Select>
      
      <Select onValueChange={onSortChange}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Terbaru</SelectItem>
          <SelectItem value="oldest">Terlama</SelectItem>
          <SelectItem value="highest">Rating Tertinggi</SelectItem>
          <SelectItem value="lowest">Rating Terendah</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}