import apiClient from '@/api/client';
import { Review, Announcement, AnnouncementFormData, VehicleDocument, VehicleImage, TripMedia } from '@/types';
import { mockStore } from './mockDataStore';

const contentService = {
  // ─── Reviews (MongoDB) ───────────────────────────────────
  getAllReviews: async (): Promise<Review[]> => {
    try {
      const res = await apiClient.get('/reviews');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getReviews();
    } catch {
      return mockStore.getReviews();
    }
  },
  getReviewsByRoute: async (routeId: number): Promise<Review[]> => {
    try {
      const res = await apiClient.get(`/reviews/route/${routeId}`);
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getReviews().filter(r => r.routeId === routeId);
    } catch {
      return mockStore.getReviews().filter(r => r.routeId === routeId);
    }
  },
  getTopRated: async (): Promise<any> => {
    try {
      const res = await apiClient.get('/reviews/top-rated');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
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
    try {
      const res = await apiClient.get(`/reviews/search?keyword=${encodeURIComponent(keyword)}`);
      return res.data;
    } catch {
      const q = keyword.toLowerCase();
      return mockStore.getReviews().filter(r =>
        (r.comment || '').toLowerCase().includes(q) ||
        (r.tags || []).some(t => t.toLowerCase().includes(q))
      );
    }
  },
  submitReview: async (data: Partial<Review>): Promise<Review> => {
    try {
      const res = await apiClient.post('/reviews', data);
      mockStore.saveReview(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveReview(data);
    }
  },

  // ─── Announcements (MongoDB) ─────────────────────────────
  getAllAnnouncements: async (): Promise<Announcement[]> => {
    try {
      const res = await apiClient.get('/announcements');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getAnnouncements();
    } catch {
      return mockStore.getAnnouncements();
    }
  },
  createAnnouncement: async (data: AnnouncementFormData): Promise<Announcement> => {
    try {
      const res = await apiClient.post('/announcements', data);
      mockStore.saveAnnouncement(res.data || data);
      return res.data;
    } catch {
      return mockStore.saveAnnouncement(data);
    }
  },
  updateAnnouncement: async (id: string, data: AnnouncementFormData): Promise<Announcement> => {
    try {
      const res = await apiClient.put(`/announcements/${id}`, data);
      mockStore.saveAnnouncement({ ...data, _id: id });
      return res.data;
    } catch {
      return mockStore.saveAnnouncement({ ...data, _id: id });
    }
  },
  deleteAnnouncement: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/announcements/${id}`);
    } catch {}
    mockStore.deleteAnnouncement(id);
  },

  // ─── Vehicle Documents (MongoDB) ─────────────────────────
  getVehicleDocuments: async (vehicleId: number): Promise<VehicleDocument[]> => {
    try {
      const res = await apiClient.get(`/documents/vehicle/${vehicleId}`);
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getDocuments(vehicleId);
    } catch {
      return mockStore.getDocuments(vehicleId);
    }
  },
  getVehicleImages: async (vehicleId: number): Promise<VehicleImage[]> => {
    try {
      const res = await apiClient.get(`/documents/vehicle/${vehicleId}/images`);
      return res.data;
    } catch {
      return [
        { _id: 'img_1', vehicleId, url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600', caption: 'Exterior View' },
        { _id: 'img_2', vehicleId, url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600', caption: 'Interior Seating' }
      ];
    }
  },
  uploadDocument: async (vehicleId: number, formData: FormData): Promise<VehicleDocument> => {
    try {
      const res = await apiClient.post(`/documents/vehicle/${vehicleId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      const file = formData.get('file') as File | null;
      const docType = (formData.get('documentType') as string) || 'Document';
      return mockStore.saveDocument(vehicleId, file?.name || 'Document.pdf', docType);
    }
  },
  deleteDocument: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/documents/${id}`);
    } catch {}
    mockStore.deleteDocument(id);
  },

  // ─── Trip Media (MongoDB) ────────────────────────────────
  getTripMedia: async (tripId: number): Promise<TripMedia[]> => {
    try {
      const res = await apiClient.get(`/media/trip/${tripId}`);
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getMedia().filter(m => m.tripId === tripId);
    } catch {
      return mockStore.getMedia().filter(m => m.tripId === tripId);
    }
  },
  getAllMedia: async (): Promise<TripMedia[]> => {
    try {
      const res = await apiClient.get('/media');
      if (Array.isArray(res.data) && res.data.length > 0) return res.data;
      return mockStore.getMedia();
    } catch {
      return mockStore.getMedia();
    }
  },
  uploadMedia: async (formData: FormData): Promise<TripMedia> => {
    try {
      const res = await apiClient.post('/media', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch {
      const caption = (formData.get('caption') as string) || 'Trip Photo';
      const tripId = Number(formData.get('tripId')) || 401;
      return mockStore.saveMedia({ caption, tripId });
    }
  },
  deleteMedia: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/media/${id}`);
    } catch {}
    mockStore.deleteMedia(id);
  },
};

export default contentService;
