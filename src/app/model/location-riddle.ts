import { Coordinate } from 'ol/coordinate';

export type LocationRiddle = {
	solved: boolean;
	username: string;
	locationRiddleId: string;
	locationRiddleImage: string;
	comments: string[];
	createdAt: number;
	rating: number;
	location?: Coordinate;
	guesses?: Guess[];
};

export type LocationRiddleDto = {
	solved: boolean;
	location_riddle_id: string;
	username: string;
	image_base64: string;
	comments: string[];
	created_at: number;
	average_rating: number;
	location?: { coordinate: Coordinate };
	guesses?: GuessDto[];
};

export type LocationRiddlePostDto = {
	image: string;
	location: Coordinate;
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
		score: number;
	};
	locationRiddle: LocationRiddle;
};

export type guessResultDto = {
	guess_result: {
		distance: number;
		score: number;
	};
	location_riddle: LocationRiddleDto;
};
