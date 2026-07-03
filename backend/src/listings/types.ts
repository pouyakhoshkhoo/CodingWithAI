export type ListingStatus = 'draft' | 'pending_review' | 'approved' | 'published' | 'rejected' | 'hidden_for_edit' | 'expired';

export type ListingRecord = {
  id: string;
  title: string;
  price: string;
  lat: number;
  lng: number;
  status: ListingStatus;
};
