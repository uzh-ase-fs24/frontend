import { Coordinate } from 'ol/coordinate';

export type LocationRiddle = {
	solved: boolean;
	username: string;
	locationRiddleId: string;
	locationRiddleImage: string;
	comments: Comment[];
	createdAt: number;
	rating: number;
	location?: Coordinate;
	guesses?: Coordinate[];
};

export type LocationRiddleDto = {
	solved: boolean;
	location_riddle_id: string;
	username: string;
	image_base64: string;
	comments: Comment[];
	created_at: number;
	average_rating: number;
	location?: Coordinate;
	guesses?: Coordinate[];
};

export type Comment = {
	username: string;
	comment: string;
};

export type LocationRiddlePostDto = {
	image: string;
	location: Coordinate;
};
