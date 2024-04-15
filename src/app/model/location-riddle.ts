export type LocationRiddle = {
  userId: string;
  locationRiddleId: string;
  locationRiddleImage: string;
  comments: string[];
  createdAt: number;
  rating: number;
};

export type LocationRiddleDto = {
  location_riddle_id: string;
  user_id: string;
  location_riddle_image: string;
  comments: string[];
  created_at: number;
  rating: number;
};
