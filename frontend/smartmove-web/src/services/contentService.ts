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
};

export default contentService;
