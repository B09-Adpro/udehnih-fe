import api from './courseApiClient';

export interface SectionCreateRequest {
  title: string;
}

export interface SectionResponse {
  id: number;
  title: string;
  courseId: number;
}

export interface ArticleCreateRequest {
  title: string;
  content: string;
  contentType: string;
}

export interface ArticleResponse {
  id: number;
  title: string;
  content: string;
  contentType: string;
  sectionId: number;
}

export const ContentService = {
  // Section operations
  createSection: async (courseId: number, data: SectionCreateRequest): Promise<SectionResponse> => {
    try {
      const response = await api.post(`/api/courses/${courseId}/sections`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create section');
    }
  },

  getSections: async (courseId: number): Promise<SectionResponse[]> => {
    try {
      const response = await api.get(`/api/courses/${courseId}/sections`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch sections');
    }
  },

  updateSection: async (courseId: number, sectionId: number, data: SectionCreateRequest): Promise<SectionResponse> => {
    try {
      const response = await api.put(`/api/courses/${courseId}/sections/${sectionId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update section');
    }
  },

  deleteSection: async (courseId: number, sectionId: number): Promise<void> => {
    try {
      await api.delete(`/api/courses/${courseId}/sections/${sectionId}`);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete section');
    }
  },

  // Article operations
  createArticle: async (courseId: number, sectionId: number, data: ArticleCreateRequest): Promise<ArticleResponse> => {
    try {
      const response = await api.post(`/api/courses/${courseId}/sections/${sectionId}/articles`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to create article');
    }
  },

  getArticles: async (courseId: number, sectionId: number): Promise<ArticleResponse[]> => {
    try {
      const response = await api.get(`/api/courses/${courseId}/sections/${sectionId}/articles`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to fetch articles');
    }
  },

  updateArticle: async (courseId: number, sectionId: number, articleId: number, data: ArticleCreateRequest): Promise<ArticleResponse> => {
    try {
      const response = await api.put(`/api/courses/${courseId}/sections/${sectionId}/articles/${articleId}`, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to update article');
    }
  },

  deleteArticle: async (courseId: number, sectionId: number, articleId: number): Promise<void> => {
    try {
      await api.delete(`/api/courses/${courseId}/sections/${sectionId}/articles/${articleId}`);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || 'Failed to delete article');
    }
  }
};