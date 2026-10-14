import apiClient from '@/api/client';
import { Review, Announcement, AnnouncementFormData, VehicleDocument, VehicleImage, TripMedia } from '@/types';

const contentService = {
  // ─── Reviews (MongoDB) ───────────────────────────────────
  getAllReviews: async (): Promise<Review[]> => {
    const res = await apiClient.get('/reviews');
    return Array.isArray(res.data) ? res.data : [];
  },
  getReviewsByRoute: async (routeId: number): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/route/${routeId}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  getTopRated: async (): Promise<any> => {
    const res = await apiClient.get('/reviews/top-rated');
    return Array.isArray(res.data) ? res.data : [];
  },
  searchReviews: async (keyword: string): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/search?keyword=${encodeURIComponent(keyword)}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  submitReview: async (data: Partial<Review>): Promise<Review> => {
    const res = await apiClient.post('/reviews', data);
    return res.data;
  },

  // ─── Announcements (MongoDB) ─────────────────────────────
  getAllAnnouncements: async (): Promise<Announcement[]> => {
    const res = await apiClient.get('/announcements');
    const items = Array.isArray(res.data) ? res.data : [];
    return items.map((a: any) => {
      const idVal = a._id ?? a.id ?? a.announcementId;
      const cleanId = typeof idVal === 'object' && idVal !== null 
        ? (idVal.$oid || idVal.toString()) 
        : (idVal ? String(idVal) : undefined);
      return {
        ...a,
        _id: cleanId,
        id: cleanId,
        announcementId: cleanId,
      };
    });
  },
  createAnnouncement: async (data: AnnouncementFormData): Promise<Announcement> => {
    const res = await apiClient.post('/announcements', data);
    const a = res.data;
    const idVal = a?._id ?? a?.id ?? a?.announcementId;
    const cleanId = typeof idVal === 'object' && idVal !== null ? (idVal.$oid || idVal.toString()) : (idVal ? String(idVal) : undefined);
    return { ...a, _id: cleanId, id: cleanId };
  },
  updateAnnouncement: async (id: string, data: AnnouncementFormData): Promise<Announcement> => {
    const cleanId = typeof id === 'object' && id !== null ? ((id as any).$oid || (id as any).toString()) : String(id);
    const res = await apiClient.put(`/announcements/${encodeURIComponent(cleanId)}`, data);
    const a = res.data;
    const idVal = a?._id ?? a?.id ?? a?.announcementId ?? cleanId;
    return { ...a, _id: String(idVal), id: String(idVal) };
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    const cleanId = typeof id === 'object' && id !== null ? ((id as any).$oid || (id as any).toString()) : String(id);
    await apiClient.delete(`/announcements/${encodeURIComponent(cleanId)}`);
  },

  // ─── Vehicle Documents (MongoDB) ─────────────────────────
  getVehicleDocuments: async (vehicleId: number): Promise<VehicleDocument[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  getVehicleImages: async (vehicleId: number): Promise<VehicleImage[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}/images`);
    return Array.isArray(res.data) ? res.data : [];
  },
  uploadDocument: async (vehicleId: number, formData: FormData): Promise<VehicleDocument> => {
    const res = await apiClient.post(`/documents/vehicle/${vehicleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
  },

  // ─── Trip Media (MongoDB) ────────────────────────────────
  getTripMedia: async (tripId: number): Promise<TripMedia[]> => {
    const res = await apiClient.get(`/media/trip/${tripId}`);
    return Array.isArray(res.data) ? res.data : [];
  },
  getAllMedia: async (): Promise<TripMedia[]> => {
    const res = await apiClient.get('/media');
    return Array.isArray(res.data) ? res.data : [];
  },
  uploadMedia: async (formData: FormData): Promise<TripMedia> => {
    const res = await apiClient.post('/media', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  deleteMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },

  // ─── Comprehensive Media Management Module (Coursework Specification) ────
  getMediaSummary: async (): Promise<any> => {
    const res = await apiClient.get('/media/summary');
    return res.data;
  },

  searchMediaItems: async (params?: {
    type?: string;
    category?: string;
    search?: string;
    vehicleId?: number;
    tripId?: number;
  }): Promise<any[]> => {
    const res = await apiClient.get('/media', { params });
    return Array.isArray(res.data) ? res.data : [];
  },

  getVehicleMediaItems: async (vehicleId: number): Promise<any[]> => {
    const res = await apiClient.get(`/media/vehicles/${vehicleId}`);
    return Array.isArray(res.data) ? res.data : [];
  },

  getVehicleDocumentItems: async (vehicleId: number): Promise<any[]> => {
    const res = await apiClient.get(`/media/vehicles/${vehicleId}/documents`);
    return Array.isArray(res.data) ? res.data : [];
  },

  uploadVehicleMediaFile: async (vehicleId: number, formData: FormData): Promise<any> => {
    const res = await apiClient.post(`/media/vehicles/${vehicleId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteVehicleMediaItem: async (vehicleId: number, mediaId: string): Promise<void> => {
    await apiClient.delete(`/media/vehicles/${vehicleId}/media/${mediaId}`);
  },

  getTripMediaItems: async (tripId: number): Promise<any[]> => {
    const res = await apiClient.get(`/media/trips/${tripId}`);
    return Array.isArray(res.data) ? res.data : [];
  },

  uploadTripMediaFile: async (tripId: number, formData: FormData): Promise<any> => {
    const res = await apiClient.post(`/media/trips/${tripId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteTripMediaItem: async (tripId: number, mediaId: string): Promise<void> => {
    await apiClient.delete(`/media/trips/${tripId}/media/${mediaId}`);
  },

  getMediaPreviewUrl: (item: any): string => {
    if (!item) return '';
    if (item.externalUrl && !item.isLocalFile) return item.externalUrl;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    if (item.streamUrl) {
      const cleanPath = item.streamUrl.startsWith('/api') ? item.streamUrl.substring(4) : item.streamUrl;
      return `${base}${cleanPath}`;
    }
    return item.externalUrl || '';
  },

  getMediaDownloadUrl: (item: any): string => {
    if (!item) return '';
    if (item.externalUrl && !item.isLocalFile) return item.externalUrl;
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    if (item.downloadUrl) {
      const cleanPath = item.downloadUrl.startsWith('/api') ? item.downloadUrl.substring(4) : item.downloadUrl;
      return `${base}${cleanPath}`;
    }
    return item.externalUrl || '';
  },

  // ─── Passenger & Driver Specialized Media Endpoints ───────────
  getPublicVehicleImages: async (vehicleId: number): Promise<any[]> => {
    const res = await apiClient.get(`/media/vehicles/${vehicleId}/public-images`);
    return Array.isArray(res.data) ? res.data : [];
  },

  uploadDriverTripEvidence: async (
    tripId: number, 
    fileOrFormData: File | FormData, 
    category?: string, 
    caption?: string, 
    isPublic?: boolean
  ): Promise<any> => {
    let fd: FormData;
    if (fileOrFormData instanceof FormData) {
      fd = fileOrFormData;
    } else {
      fd = new FormData();
      fd.append('file', fileOrFormData);
      if (category) fd.append('category', category);
      if (caption) fd.append('caption', caption);
      if (isPublic !== undefined) fd.append('isPublic', String(isPublic));
    }
    const res = await apiClient.post(`/media/trips/${tripId}/driver-upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  deleteTripMedia: async (id: string): Promise<void> => {
    await apiClient.delete(`/media/${id}`);
  },

  getMediaFileUrl: (id: string): string => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    return `${base}/media/${id}/file`;
  },

  getVehicleDocumentFileUrl: (id: string): string => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    return `${base}/documents/${id}/file`;
  },

  uploadReviewAttachment: async (reviewId: string, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await apiClient.post(`/reviews/${encodeURIComponent(reviewId)}/attachments`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getReviewAttachmentUrl: (reviewId: string, attachmentId: string): string => {
    const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
    return `${base}/reviews/${encodeURIComponent(reviewId)}/attachments/${encodeURIComponent(attachmentId)}`;
  },
};

export default contentService;

