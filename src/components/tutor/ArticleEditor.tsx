"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, Save, X } from 'lucide-react';
import { Article } from '@/modules/CourseContentModule/interface';
import { CONTENT_TYPES } from '@/modules/CourseContentModule/constant';

interface ArticleEditorProps {
  article?: Article;
  sectionId: number;
  onSave?: (article: Partial<Article>) => void;
  onCancel?: () => void;
}

export const ArticleEditor: React.FC<ArticleEditorProps> = ({
  article,
  sectionId,
  onSave,
  onCancel
}) => {
  const [title, setTitle] = useState(article?.title || '');
  const [content, setContent] = useState(article?.content || '');
  const [contentType, setContentType] = useState(article?.contentType || 'TEXT');

  const handleSave = () => {
    const articleData = {
      title,
      content,
      contentType,
      sectionId
    };
    onSave?.(articleData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {article ? 'Edit Artikel' : 'Buat Artikel Baru'}
        </CardTitle>
        <CardDescription>
          {article ? 'Edit artikel yang sudah ada' : 'Tambahkan artikel baru ke section ini'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="article-title">Judul Artikel</Label>
          <Input
            id="article-title"
            placeholder="Masukkan judul artikel..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Content Type */}
        <div className="space-y-2">
          <Label htmlFor="content-type">Tipe Konten</Label>
          <select
            id="content-type"
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {CONTENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="article-content">Konten</Label>
          <textarea
            id="article-content"
            placeholder="Masukkan konten artikel..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button onClick={handleSave} className="flex-1">
            <Save className="mr-2 h-4 w-4" />
            {article ? 'Update' : 'Simpan'}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};