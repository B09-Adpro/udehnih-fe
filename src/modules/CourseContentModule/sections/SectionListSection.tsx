"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  BookOpen, 
  FileText, 
  ArrowLeft,
  Settings,
  Edit,
  Trash2,
  Save,
  X,
  AlertCircle
} from 'lucide-react';
import { ContentService } from '@/lib/services/content.service';
import { Section, Article } from '../interface';
import { SectionFormValues, ArticleFormValues } from '../interface';
import { toast } from 'sonner';
import Link from 'next/link';

interface SectionListSectionProps {
  courseId: number;
}

interface SectionWithArticles extends Section {
  articles: Article[];
}

export const SectionListSection: React.FC<SectionListSectionProps> = ({ courseId }) => {
  const [sections, setSections] = useState<SectionWithArticles[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSection, setIsCreatingSection] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState<number | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [editSectionTitle, setEditSectionTitle] = useState('');
  
  // Article states
  const [creatingArticleForSection, setCreatingArticleForSection] = useState<number | null>(null);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [newArticle, setNewArticle] = useState<ArticleFormValues>({
    title: '',
    content: '',
    contentType: 'TEXT'
  });
  const [editArticle, setEditArticle] = useState<ArticleFormValues>({
    title: '',
    content: '',
    contentType: 'TEXT'
  });

  useEffect(() => {
    fetchSections();
  }, [courseId]);

  const fetchSections = async () => {
    try {
      const sectionsData = await ContentService.getSections(courseId);
      
      // Fetch articles for each section
      const sectionsWithArticles = await Promise.all(
        sectionsData.map(async (section) => {
          try {
            const articles = await ContentService.getArticles(courseId, section.id);
            return { ...section, articles };
          } catch (error) {
            console.error(`Failed to fetch articles for section ${section.id}:`, error);
            return { ...section, articles: [] };
          }
        })
      );
      
      setSections(sectionsWithArticles);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load course content');
    } finally {
      setIsLoading(false);
    }
  };

  // Section operations
  const handleCreateSection = async () => {
    if (!newSectionTitle.trim()) {
      toast.error('Section title is required');
      return;
    }

    try {
      await ContentService.createSection(courseId, { title: newSectionTitle });
      toast.success('Section created successfully');
      setNewSectionTitle('');
      setIsCreatingSection(false);
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create section');
    }
  };

  const handleUpdateSection = async (sectionId: number) => {
    if (!editSectionTitle.trim()) {
      toast.error('Section title is required');
      return;
    }

    try {
      await ContentService.updateSection(courseId, sectionId, { title: editSectionTitle });
      toast.success('Section updated successfully');
      setEditingSectionId(null);
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update section');
    }
  };

  const handleDeleteSection = async (sectionId: number, sectionTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete section "${sectionTitle}"? This will also delete all articles in this section.`)) {
      return;
    }

    try {
      await ContentService.deleteSection(courseId, sectionId);
      toast.success('Section deleted successfully');
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete section');
    }
  };

  // Article operations
  const handleCreateArticle = async (sectionId: number) => {
    if (!newArticle.title.trim() || !newArticle.content.trim()) {
      toast.error('Article title and content are required');
      return;
    }

    try {
      await ContentService.createArticle(courseId, sectionId, newArticle);
      toast.success('Article created successfully');
      setNewArticle({ title: '', content: '', contentType: 'TEXT' });
      setCreatingArticleForSection(null);
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create article');
    }
  };

  const handleUpdateArticle = async (sectionId: number, articleId: number) => {
    if (!editArticle.title.trim() || !editArticle.content.trim()) {
      toast.error('Article title and content are required');
      return;
    }

    try {
      await ContentService.updateArticle(courseId, sectionId, articleId, editArticle);
      toast.success('Article updated successfully');
      setEditingArticleId(null);
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update article');
    }
  };

  const handleDeleteArticle = async (sectionId: number, articleId: number, articleTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete article "${articleTitle}"?`)) {
      return;
    }

    try {
      await ContentService.deleteArticle(courseId, sectionId, articleId);
      toast.success('Article deleted successfully');
      fetchSections();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete article');
    }
  };

  if (isLoading) {
    return (
      <section className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full py-12">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/tutor/courses">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar Kursus
            </Link>
          </Button>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Kelola Konten Kursus
              </h1>
              <p className="text-gray-600">
                Buat dan kelola section serta artikel untuk kursus Anda
              </p>
            </div>
            <Button 
              onClick={() => setIsCreatingSection(true)}
              className="mt-4 md:mt-0"
              disabled={isCreatingSection}
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Section
            </Button>
          </div>
        </div>

        {/* Create Section Form */}
        {isCreatingSection && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Buat Section Baru</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="new-section-title">Judul Section</Label>
                <Input
                  id="new-section-title"
                  placeholder="Masukkan judul section..."
                  value={newSectionTitle}
                  onChange={(e) => setNewSectionTitle(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateSection}>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingSection(false);
                    setNewSectionTitle('');
                  }}
                >
                  <X className="mr-2 h-4 w-4" />
                  Batal
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sections List */}
        {sections.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum Ada Section</h3>
              <p className="text-gray-600 mb-6">
                Mulai dengan membuat section pertama untuk kursus Anda
              </p>
              <Button onClick={() => setIsCreatingSection(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Section Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {sections.map((section, sectionIndex) => (
              <Card key={section.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="h-5 w-5 text-primary" />
                      {editingSectionId === section.id ? (
                        <Input
                          value={editSectionTitle}
                          onChange={(e) => setEditSectionTitle(e.target.value)}
                          className="font-medium"
                        />
                      ) : (
                        <h3 className="text-xl font-semibold">{section.title}</h3>
                      )}
                      <Badge variant="outline">
                        {section.articles.length} artikel
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {editingSectionId === section.id ? (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleUpdateSection(section.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setEditingSectionId(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setEditingSectionId(section.id);
                              setEditSectionTitle(section.title);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => setCreatingArticleForSection(section.id)}
                          >
                            <Plus className="mr-1 h-4 w-4" />
                            Artikel
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteSection(section.id, section.title)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Create Article Form */}
                  {creatingArticleForSection === section.id && (
                    <Card className="mb-4 bg-blue-50">
                      <CardContent className="pt-4">
                        <h4 className="font-medium mb-3">Buat Artikel Baru</h4>
                        <div className="space-y-3">
                          <div>
                            <Label>Judul Artikel</Label>
                            <Input
                              placeholder="Masukkan judul artikel..."
                              value={newArticle.title}
                              onChange={(e) => setNewArticle({...newArticle, title: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Tipe Konten</Label>
                            <select
                              className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                              value={newArticle.contentType}
                              onChange={(e) => setNewArticle({...newArticle, contentType: e.target.value})}
                            >
                              <option value="TEXT">Teks</option>
                              <option value="VIDEO_URL">URL Video</option>
                              <option value="IMAGE_URL">URL Gambar</option>
                              <option value="MARKDOWN">Markdown</option>
                            </select>
                          </div>
                          <div>
                            <Label>Konten</Label>
                            <textarea
                              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                              rows={4}
                              placeholder="Masukkan konten artikel..."
                              value={newArticle.content}
                              onChange={(e) => setNewArticle({...newArticle, content: e.target.value})}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => handleCreateArticle(section.id)}
                            >
                              <Save className="mr-1 h-4 w-4" />
                              Simpan
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCreatingArticleForSection(null);
                                setNewArticle({ title: '', content: '', contentType: 'TEXT' });
                              }}
                            >
                              <X className="mr-1 h-4 w-4" />
                              Batal
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Articles List */}
                  {section.articles.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-3">Belum ada artikel di section ini</p>
                      <Button 
                        size="sm"
                        onClick={() => setCreatingArticleForSection(section.id)}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        Tambah Artikel Pertama
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {section.articles.map((article) => (
                        <div key={article.id} className="border rounded-lg p-4 bg-white">
                          {editingArticleId === article.id ? (
                            // Edit Article Form
                            <div className="space-y-3">
                              <div>
                                <Label>Judul Artikel</Label>
                                <Input
                                  value={editArticle.title}
                                  onChange={(e) => setEditArticle({...editArticle, title: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label>Tipe Konten</Label>
                                <select
                                  className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                                  value={editArticle.contentType}
                                  onChange={(e) => setEditArticle({...editArticle, contentType: e.target.value})}
                                >
                                  <option value="TEXT">Teks</option>
                                  <option value="VIDEO_URL">URL Video</option>
                                  <option value="IMAGE_URL">URL Gambar</option>
                                  <option value="MARKDOWN">Markdown</option>
                                </select>
                              </div>
                              <div>
                                <Label>Konten</Label>
                                <textarea
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md resize-y"
                                  rows={4}
                                  value={editArticle.content}
                                  onChange={(e) => setEditArticle({...editArticle, content: e.target.value})}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  size="sm"
                                  onClick={() => handleUpdateArticle(section.id, article.id)}
                                >
                                  <Save className="mr-1 h-4 w-4" />
                                  Update
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setEditingArticleId(null)}
                                >
                                  <X className="mr-1 h-4 w-4" />
                                  Batal
                                </Button>
                              </div>
                            </div>
                          ) : (
                            // Display Article
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-blue-600" />
                                  <h4 className="font-medium">{article.title}</h4>
                                  <Badge variant="outline" className="text-xs">
                                    {article.contentType}
                                  </Badge>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    onClick={() => {
                                      setEditingArticleId(article.id);
                                      setEditArticle({
                                        title: article.title,
                                        content: article.content,
                                        contentType: article.contentType
                                      });
                                    }}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteArticle(section.id, article.id, article.title)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                <p className="line-clamp-3">{article.content}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {sections.length > 0 && (
          <Card className="mt-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{sections.length}</div>
                  <div className="text-sm text-gray-600">Total Section</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {sections.reduce((total, section) => total + section.articles.length, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Artikel</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {sections.filter(s => s.articles.length > 0).length}
                  </div>
                  <div className="text-sm text-gray-600">Section dengan Konten</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};