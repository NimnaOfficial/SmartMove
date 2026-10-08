import apiClient from '@/api/client';
import { Review, Announcement, AnnouncementFormData, VehicleDocument, VehicleImage, TripMedia } from '@/types';

const contentService = {
  // ─── Reviews (MongoDB) ───────────────────────────────────
  getAllReviews: async (): Promise<Review[]> => {
    const res = await apiClient.get('/reviews');
    return res.data;
  },
  getReviewsByRoute: async (routeId: number): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/route/${routeId}`);
    return res.data;
  },
  getTopRated: async (): Promise<any> => {
    const res = await apiClient.get('/reviews/top-rated');
    return res.data;
  },
  searchReviews: async (keyword: string): Promise<Review[]> => {
    const res = await apiClient.get(`/reviews/search?keyword=${encodeURIComponent(keyword)}`);
    return res.data;
  },
  submitReview: async (data: Partial<Review>): Promise<Review> => {
    const res = await apiClient.post('/reviews', data);
    return res.data;
  },

  // ─── Announcements (MongoDB) ─────────────────────────────
  getAllAnnouncements: async (): Promise<Announcement[]> => {
    const res = await apiClient.get('/announcements');
    return res.data;
  },
  createAnnouncement: async (data: AnnouncementFormData): Promise<Announcement> => {
    const res = await apiClient.post('/announcements', data);
    return res.data;
  },
  updateAnnouncement: async (id: string, data: AnnouncementFormData): Promise<Announcement> => {
    const res = await apiClient.put(`/announcements/${id}`, data);
    return res.data;
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    await apiClient.delete(`/announcements/${id}`);
  },

  // ─── Vehicle Documents (MongoDB) ─────────────────────────
  getVehicleDocuments: async (vehicleId: number): Promise<VehicleDocument[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}`);
    return res.data;
  },
  getVehicleImages: async (vehicleId: number): Promise<VehicleImage[]> => {
    const res = await apiClient.get(`/documents/vehicle/${vehicleId}/images`);
    return res.data;
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
    return res.data;
  },
  getAllMedia: async (): Promise<TripMedia[]> => {
    const res = await apiClient.get('/media');
    return res.data;
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
