export type User = {
	username: string;
	firstName: string;
	lastName: string;
	bio: string;
	averageScore: number;
};

export type UserDto = {
	username: string;
	first_name: string;
	last_name: string;
	bio: string;
	average_score: number;
};

export type UserConnectionsDto = {
	following: UserDto[];
	followers: UserDto[];
};

export type UserConnections = {
	following: User[];
	followers: User[];
};

export type UserFormDto = {
	first_name: string;
	last_name: string;
	bio: string;
};

export type UserForm = {
	firstName: string;
	lastName: string;
	bio: string;
};
