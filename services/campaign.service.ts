// services/campaign.service.ts

import { api } from "./api";

export const getCampaigns = async () => {
  const response = await api.get(
    "/candidates/get-select"
  );


  console.log("getCampaigns response:", response?.data?.campaigns || response);
  return response?.data?.campaigns;
};

