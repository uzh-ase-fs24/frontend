import { Coordinate } from 'ol/coordinate';

export type LocationRiddle = {
	solved: boolean;
	userId: string;
	locationRiddleId: string;
	locationRiddleImage: string;
	comments: string[];
	createdAt: number;
	rating: number;
	location?: Coordinate;
	guesses?: guess[];
};

export type LocationRiddleDto = {
	solved: boolean;
	location_riddle_id: string;
	user_id: string;
	image_base64: string;
	comments: string[];
	created_at: number;
	average_rating: number;
	location?: Coordinate;
	guesses?: guess[];
};

export type LocationRiddlePostDto = {
	image: string;
	location: Coordinate;
};

export type guess = {
	guess: Coordinate;
	userId: string;
};
