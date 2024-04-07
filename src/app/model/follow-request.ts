export type FollowRequestDto = {
  username: string;
  requester_id: string;
  requestee_id: string;
  status: string;
  timestamp: string;
};

export type FollowRequest = {
  username: string
  requesterId: string;
  requesteeId: string;
  status: string;
  timestamp: string;
};
