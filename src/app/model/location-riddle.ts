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
	rated?: boolean;
	guesses?: Guess[];
};

export type LocationRiddleDto = {
	solved: boolean;
	location_riddle_id: string;
	username: string;
	image_base64: string;
	comments: Comment[];
	created_at: number;
	average_rating: number;
	is_rated_by_user?: boolean;
	location?: { coordinate: Coordinate };
	guesses?: GuessDto[];
};

export type Comment = {
	username: string;
	comment: string;
};

export type LocationRiddlePostDto = {
	image: string;
	location: Coordinate;
	arenas: string[];
};

export type Guess = {
	guess: Coordinate;
	username: string;
};

export type GuessDto = {
	guess: {
		coordinate: Coordinate;
	};
	username: string;
};

export type GuessResult = {
	guessResult: {
		distance: number;
		received_score: number;
	};
	locationRiddle: LocationRiddle;
};

export type guessResultDto = {
	guess_result: {
		distance: number;
		received_score: number;
	};
	location_riddle: LocationRiddleDto;
};
