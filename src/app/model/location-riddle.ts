import { Coordinate } from 'ol/coordinate';

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
	location_riddle_image: {
		image_base64: string;
	};
	comments: string[];
	created_at: number;
	average_rating: number;
};

export type LocationRiddlePostDto = {
	image: string;
	location: Coordinate;
};
