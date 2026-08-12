// store/campaign.store.ts

import AsyncStorage from "@react-native-async-storage/async-storage";


import { getCampaigns } from "@/services/campaign.service";

const CAMPAIGNS_STORAGE_KEY = "campaigns";



/* ================= GET CAMPAIGNS ================= */

export const fetchCampaigns = async (
  setState: any,
) => {
  try {
    setState((prev: any) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    console.log("Fetching campaigns...");

    /* ---------- Try Local Storage First ---------- */

    const localCampaigns =
      await AsyncStorage.getItem(
        CAMPAIGNS_STORAGE_KEY
      );

    if (localCampaigns) {
      const parsed = JSON.parse(localCampaigns);

      setState((prev: any) => ({
        ...prev,
        campaigns: parsed,
      }));
    }

    /* ---------- Fetch Latest From API ---------- */

    const response = await getCampaigns();

    console.log("API response:", response);

    const campaigns = response?.data || response;

    /* ---------- Save To Async Storage ---------- */

    await AsyncStorage.setItem(
      CAMPAIGNS_STORAGE_KEY,
      JSON.stringify(campaigns)
    );

    /* ---------- Update State ---------- */

    setState((prev: any) => ({
      ...prev,
      campaigns,
    }));

    console.log("Campaigns fetched:", campaigns);
  } catch (error: any) {
    setState((prev: any) => ({
      ...prev,
      error:
        error?.response?.data?.message ||
        "Failed to fetch campaigns",
    }));
  } finally {
    setState((prev: any) => ({
      ...prev,
      loading: false,
    }));
  }
};

/* ================= SELECT CAMPAIGN ================= */

export const selectCampaign = async (
  campaign: any,
  setState: any
) => {
  await AsyncStorage.setItem(
    "selected_campaign",
    JSON.stringify(campaign)
  );

  setState((prev: any) => ({
    ...prev,
    selectedCampaign: campaign,
  }));
};

/* ================= LOAD SELECTED CAMPAIGN ================= */

export const loadSelectedCampaign = async (
  setState: any
) => {
  const campaign = await AsyncStorage.getItem(
    "selected_campaign"
  );

  if (!campaign) return;

  setState((prev: any) => ({
    ...prev,
    selectedCampaign: JSON.parse(campaign),
  }));
};