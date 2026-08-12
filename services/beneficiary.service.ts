// services/beneficiary.service.ts

import { api } from "./api";

export const searchBeneficiaries = async ({
  campaignId,
  query,
}: {
  campaignId: number;
  query: string;
}) => {
  const response = await api.get(
    "/beneficiaries/search",
    {
      params: {
        campaign_id: campaignId,
        query,
      },
    }
  );

  return response.data;
};