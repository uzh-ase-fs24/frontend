export type FollowRequestDto = {
  requester_id: string;
  requestee_id: string;
  status: string;
  timestamp: string;
};

export type FollowRequest = {
  requesterId: string;
  requesteeId: string;
  status: string;
  timestamp: string;
};
