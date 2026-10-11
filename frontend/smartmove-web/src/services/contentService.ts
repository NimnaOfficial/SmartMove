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
    try {
      const res = await apiClient.get('/reviews');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getReviews();
    } catch {
      return mockStore.getReviews();
    }
  },
  getReviewsByRoute: async (routeId: number): Promise<Review[]> => {
    try {
      const res = await apiClient.get(`/reviews/route/${routeId}`);
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getReviews().filter(r => r.routeId === routeId);
    } catch {
      return mockStore.getReviews().filter(r => r.routeId === routeId);
    }
  },
  getTopRated: async (): Promise<any> => {
    try {
      const res = await apiClient.get('/reviews/top-rated');
      if (Array.isArray(res.data)) return res.data;
      const reviews = mockStore.getReviews();
      const map: { [key: number]: { count: number; total: number } } = {};
      reviews.forEach(r => {
        if (r.vehicleId) {
          if (!map[r.vehicleId]) map[r.vehicleId] = { count: 0, total: 0 };
          map[r.vehicleId].count++;
          map[r.vehicleId].total += r.rating;
        }
      });
      return Object.keys(map).map(k => ({
        _id: Number(k),
        avgRating: map[Number(k)].total / map[Number(k)].count,
        count: map[Number(k)].count
      })).sort((a, b) => b.avgRating - a.avgRating);
    } catch {
      return [
        { _id: 101, avgRating: 4.9, count: 18 },
        { _id: 104, avgRating: 4.8, count: 12 },
        { _id: 102, avgRating: 4.5, count: 15 }
      ];
    }
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
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get('/announcements');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getAnnouncements();
    } catch {
      return mockStore.getAnnouncements();
    }
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
    return Array.isArray(res.data) ? res.data : [];
    try {
      const res = await apiClient.get(`/documents/vehicle/${vehicleId}`);
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getDocuments(vehicleId);
    } catch {
      return mockStore.getDocuments(vehicleId);
    }
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
    try {
      const res = await apiClient.get(`/media/trip/${tripId}`);
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getMedia().filter(m => m.tripId === tripId);
    } catch {
      return mockStore.getMedia().filter(m => m.tripId === tripId);
    }
  },
  getAllMedia: async (): Promise<TripMedia[]> => {
    try {
      const res = await apiClient.get('/media');
      if (Array.isArray(res.data)) return res.data;
      return mockStore.getMedia();
    } catch {
      return mockStore.getMedia();
    }
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
