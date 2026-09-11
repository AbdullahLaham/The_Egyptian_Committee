// services/campaign.service.ts

import { api } from "./api";

export const getCampaigns = async () => {
  const response = await api.get(
    "/candidates/get-select"
  );
  return response?.data?.campaigns;
};

