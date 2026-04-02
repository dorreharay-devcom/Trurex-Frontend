export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export enum AssetType {
  Luxury = 'luxury',
  RealEstate = 'realestate',
  Automotive = 'automotive',
  Watch = 'watch',
}

export enum AssetStatus {
  Active = 'active',
  Pending = 'pending',
  Sold = 'sold',
}

export interface Asset {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  price?: number;
  imageUrl?: string;
  status: AssetStatus;
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  error: string | null;
  status: number;
}
