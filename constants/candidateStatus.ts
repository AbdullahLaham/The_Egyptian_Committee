// constants/candidateStatus.ts

export const CANDIDATE_STATUS = {
  PENDING: "مرشح",
  DELIVERED: "مستلم",
} as const;

export type CandidateStatus =
  (typeof CANDIDATE_STATUS)[keyof typeof CANDIDATE_STATUS];

export const toggleStatus = (
  status: CandidateStatus
): CandidateStatus => {
  return status === CANDIDATE_STATUS.DELIVERED
    ? CANDIDATE_STATUS.PENDING
    : CANDIDATE_STATUS.DELIVERED;
};