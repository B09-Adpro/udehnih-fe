"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Edit, Trash2, Plus } from 'lucide-react';
import { Section } from '@/modules/CourseContentModule/interface';

interface SectionCardProps {
  section: Section;
  onEdit?: (section: Section) => void;
  onDelete?: (sectionId: number) => void;
  onAddArticle?: (sectionId: number) => void;
}

export const SectionCard: React.FC<SectionCardProps> = ({
  section,
  onEdit,
  onDelete,
  onAddArticle
}) => {
  const articleCount = section.articles?.length || 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <span className="line-clamp-1">{section.title}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {articleCount} artikel
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-gray-600">
          Section ini memiliki {articleCount} artikel
        </p>
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onEdit?.(section)}
        >
          <Edit className="mr-1 h-4 w-4" />
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onAddArticle?.(section.id)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Artikel
        </Button>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={() => onDelete?.(section.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};