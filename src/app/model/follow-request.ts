export type FollowRequestDto = {
  requester_username: string;
  requester_id: string;
  requestee_id: string;
  status: string;
  timestamp: string;
};

export type FollowRequest = {
  requester_username: string
  requesterId: string;
  requesteeId: string;
  status: string;
  timestamp: string;
};
