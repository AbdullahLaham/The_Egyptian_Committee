import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
} from "react-native";

import {
  Ionicons,
} from "@expo/vector-icons";

import { useEffect, useState } from "react";

import { useDebounce } from "use-debounce";

import {
  fetchCampaigns,
  loadSelectedCampaign,
  selectCampaign,
} from "@/store/campaign.store";

import {
  getCampaignCandidates,
  updateCandidateStatus,
} from "@/services/candidates.service";

import CandidatesSection from "@/components/home/CandidatesSection";

import CandidateDeliveryModal from "@/components/home/CandidateDeliveryModal";
import {
  CANDIDATE_STATUS,
  toggleStatus,
} from "@/constants/candidateStatus";
export default function HomeScreen() {
  const [search, setSearch] =
    useState("");

  const [campaignState, setCampaignState] =
    useState({
      campaigns: [],
      selectedCampaign: null,
      loading: false,
      error: null,
    });

  /* ================= CANDIDATES ================= */

  const [candidates, setCandidates] =
    useState<any[]>([]);

  const [candidatesLoading, setCandidatesLoading] =
    useState(false);

  const [candidatesPage, setCandidatesPage] =
    useState(1);

  const [hasMoreCandidates, setHasMoreCandidates] =
    useState(true);

  const [totalCandidates, setTotalCandidates] =
    useState(0);

  /* ================= MODAL ================= */

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] = useState<any>(null);

  const [
    deliveryModalVisible,
    setDeliveryModalVisible,
  ] = useState(false);

  const [
    updatingCandidate,
    setUpdatingCandidate,
  ] = useState(false);

  /* ================= SEARCH ================= */

  const [debouncedSearch] =
    useDebounce(search, 2000); // search

  /* ================= FETCH CANDIDATES ================= */

  const fetchCandidates = async ({
    page = 1,
    reset = false,
    query = "",
  }: any) => {
    try {
      if (
        !campaignState.selectedCampaign
      )
        return;

      setCandidatesLoading(true);

      const response =
        await getCampaignCandidates({
          page,
          campaignId:
            campaignState.selectedCampaign?.id,
          search: query,
        });

      const newData =
        response?.data || [];

      setCandidates((prev) =>
        reset
          ? newData
          : [...prev, ...newData]
      );

      setHasMoreCandidates(
        response.current_page <
        response.last_page
      );

      setCandidatesPage(
        response.current_page
      );

      setTotalCandidates(
        response.total
      );
    } catch (error) {
      console.log(error);
    } finally {
      setCandidatesLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */

  // const handleDeliverCandidate =
  //   async () => {
  //     try {
  //       if (!selectedCandidate)
  //         return;

  //       setUpdatingCandidate(true);

  //       // const nextStatus =
  //       //   selectedCandidate.status ===
  //       //   "مستلم"
  //       //     ? "مرشح"
  //       //     : "مستلم";

  //       const nextStatus = "مستلم";

  //       await updateCandidateStatus({
  //         candidateId:
  //           selectedCandidate.id,

  //         status: nextStatus,
  //       });

  //       /* UPDATE UI */

  //       setCandidates((prev) =>
  //         prev.map((item) =>
  //           item.id ===
  //           selectedCandidate.id
  //             ? {
  //                 ...item,
  //                 status: nextStatus,
  //               }
  //             : item
  //         )
  //       );

  //       setSelectedCandidate(
  //         (prev: any) => ({
  //           ...prev,
  //           status: nextStatus,
  //         })
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setUpdatingCandidate(false);
  //     }
  //   };



  //   const handleDeliverCandidate = async () => {
  //   try {
  //     if (!selectedCandidate) return;

  //     setUpdatingCandidate(true);

  //     const nextStatus = toggleStatus(
  //       selectedCandidate.status
  //     );

  //     await updateCandidateStatus({
  //       candidateId: selectedCandidate.id,
  //       status: nextStatus,
  //     });

  //     // Update UI
  //     setCandidates((prev) =>
  //       prev.map((item) =>
  //         item.id === selectedCandidate.id
  //           ? { ...item, status: nextStatus }
  //           : item
  //       )
  //     );

  //     setSelectedCandidate((prev: any) => ({
  //       ...prev,
  //       status: nextStatus,
  //     }));
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setUpdatingCandidate(false);
  //   }
  // };


  const handleDeliverCandidate =
    async (image: any) => {
      try {
        if (!selectedCandidate)
          return;

        setUpdatingCandidate(true);

        const nextStatus =
          selectedCandidate.status ===
            "مستلم"
            ? "مرشح"
            : "مستلم";

        // const formData =
        //   new FormData();

        // formData.append(
        //   "status",
        //   nextStatus
        // );

        /* OPTIONAL IMAGE */

        // if (
        //   image?.uri &&
        //   selectedCandidate.status ===
        //     "مستلم"
        // ) {

        //   console.log("Appending image to form data:", {
        //     image: {
        //       uri: image.uri,
        //       name: "candidate-id.jpg",
        //       type: "image/jpeg",
        //     },
        //   });

        //   formData.append(
        //     "img",
        //     {
        //       uri: image.uri,
        //       name:
        //         "candidate-id.jpg",
        //       type: "image/jpeg",
        //     } as any
        //   );
        // }

        const res = await updateCandidateStatus({
          candidateId:
            selectedCandidate.id,

          status: nextStatus,

          // image,
        });

        /* UPDATE CANDIDATES */

        setCandidates((prev) =>
          prev.map((item) =>
            item.id ===
              selectedCandidate.id
              ? {
                ...item,
                status: nextStatus,
              }
              : item
          )
        );

        /* UPDATE MODAL */

        setSelectedCandidate(
          (prev: any) => ({
            ...prev,
            status: nextStatus,
          })
        );

        return res;
      } catch (error) {
        console.log(error);
      } finally {
        setUpdatingCandidate(false);
      }
    };

  /* ================= LOAD MORE ================= */

  const loadMoreCandidates = () => {
    if (
      candidatesLoading ||
      !hasMoreCandidates
    )
      return;

    fetchCandidates({
      page: candidatesPage + 1,
      query: debouncedSearch,
    });
  };

  /* ================= EFFECTS ================= */

  useEffect(() => {
    fetchCampaigns(setCampaignState);

    loadSelectedCampaign(
      setCampaignState
    );
  }, []);

  useEffect(() => {
    if (
      !campaignState.selectedCampaign
    )
      return;

    setCandidates([]);

    setCandidatesPage(1);

    fetchCandidates({
      page: 1,
      reset: true,
      query: debouncedSearch,
    });
  }, [
    campaignState.selectedCampaign,
    debouncedSearch,
  ]);

  return (
    <View className="flex-1 bg-brand-secondary">
      <StatusBar barStyle="light-content" />

      {/* BG */}

      <View className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-brand-primary/20" />

      <View className="absolute bottom-0 -right-24 w-80 h-80 rounded-full bg-brand-green/10" />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={{
          paddingBottom: 160,
        }}
      >
        {/* HEADER */}

        <View className="px-5 pt-16">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-gray-300 text-lg">
                👋 مرحباً بك
              </Text>

              <Text className="text-brand-white text-4xl font-extrabold mt-2">
                اللجنة المصرية
              </Text>

              <Text className="text-gray-400 text-base mt-1">
                لإغاثة أهلنا في غزة
              </Text>

              <View className="flex-row items-center mt-4">
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color="#D1D5DB"
                />

                <Text className="text-gray-300 mr-2 text-sm">
                  {new Date().toLocaleDateString(
                    "ar-EG",
                    {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </Text>
              </View>
            </View>

            <View className="w-24 h-24 rounded-[28px] bg-brand-white/10 border border-brand-white/10 items-center justify-center overflow-hidden">
              <Image
                source={require("@/assets/images/micon.png")}
                className="w-20 h-20"
                resizeMode="contain"
              />
            </View>
          </View>
        </View>

        {/* SEARCH */}

        <View className="px-5 mt-8">
          <View className="rounded-[32px] border border-brand-white/10 bg-brand-white/5 px-5 py-5 shadow-brand">

            <Text className="text-gray-300 text-base mb-4 font-bold">
              البحث عن مرشح
            </Text>

            <View className="flex-row items-center bg-black/20 border border-brand-white/10 rounded-2xl px-4">

              <Ionicons
                name="search"
                size={22}
                color="#9CA3AF"
              />

              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="ابحث بالاسم أو الهوية أو الجوال"
                placeholderTextColor="#9CA3AF"
                className="flex-1 text-brand-white text-base px-3 py-4 text-right"
              />

              {candidatesLoading && (
                <ActivityIndicator color="#fff" />
              )}
            </View>
          </View>
        </View>

        {/* CAMPAIGNS */}

        <View className="mt-8">
          <View className="px-5 mb-5">
            <Text className="text-brand-white text-2xl font-extrabold">
              الحملات المتوفرة
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={{
              gap: 12,
              paddingHorizontal: 20,
            }}
          >
            {campaignState.campaigns.map(
              (campaign: any) => {
                const isSelected =
                  campaignState
                    .selectedCampaign
                    ?.id === campaign.id;

                return (
                  <Pressable
                    key={campaign.id}
                    onPress={() =>
                      selectCampaign(
                        campaign,
                        setCampaignState
                      )
                    }
                    className={`px-6 py-5 rounded-[26px] border ${isSelected
                        ? "bg-brand-primary border-brand-primary"
                        : "bg-brand-white/5 border-brand-white/10"
                      }`}
                  >
                    <Text
                      className={`font-extrabold text-base ${isSelected
                          ? "text-white"
                          : "text-brand-white"
                        }`}
                    >
                      {campaign.name}
                    </Text>

                    <Text
                      className={`mt-2 ${isSelected
                          ? "text-white/80"
                          : "text-gray-400"
                        }`}
                    >
                      {campaign.type}
                    </Text>
                  </Pressable>
                );
              }
            )}
          </ScrollView>
        </View>

        {/* CANDIDATES */}

        <CandidatesSection
          candidates={candidates}
          loading={candidatesLoading}
          hasMore={hasMoreCandidates}
          currentPage={candidatesPage}
          total={totalCandidates}
          selectedCampaignName={
            campaignState
              .selectedCampaign?.name
          }
          onLoadMore={
            loadMoreCandidates
          }
          onPressItem={(
            candidate: any
          ) => {
            setSelectedCandidate(
              candidate
            );

            setDeliveryModalVisible(
              true
            );
          }}
        />
      </ScrollView>

      {/* MODAL */}

      <CandidateDeliveryModal
        visible={deliveryModalVisible}
        candidate={selectedCandidate}
        loading={updatingCandidate}
        onClose={() => {
          setDeliveryModalVisible(
            false
          );

          setSelectedCandidate(
            null
          );
        }}
        onConfirm={
          handleDeliverCandidate
        }
      />
    </View>
  );
}