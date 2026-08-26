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
import { DrawerActions, useNavigation } from "@react-navigation/native";
import HomeHeader from "@/components/home/HomeHeader";
import Campaigns from "@/app/campaigns";
import { SafeAreaView } from "react-native-safe-area-context";
export default function HomeScreen() {

  const navigation = useNavigation();


  const [search, setSearch] =
    useState("");


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



  /* ================= LOAD MORE ================= */


  /* ================= EFFECTS ================= */

  // useEffect(() => {
  //   fetchCampaigns(setCampaignState);

  //   loadSelectedCampaign(
  //     setCampaignState
  //   );
  // }, []);

  // useEffect(() => {
  //   if (
  //     !campaignState.selectedCampaign
  //   )
  //     return;

  //   setCandidates([]);

  //   setCandidatesPage(1);

  //   fetchCandidates({
  //     page: 1,
  //     reset: true,
  //     query: debouncedSearch,
  //   });
  // }, [
  //   campaignState.selectedCampaign,
  //   debouncedSearch,
  // ]);

  return (
    <SafeAreaView className="flex-1 bg-brand-secondary">
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

        <HomeHeader />

        <View className="px-5 pt-16">
          {/* <View className="flex-row items-center justify-between">
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
          </View> */}
        </View>

        {/* SEARCH */}

        {/* <View className="px-5 mt-8">
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
        </View> */}

        {/* CAMPAIGNS */}

        {/* <View className="mt-8">
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
        </View> */}
        {/* <Campaigns campaignState={campaignState} selectCampaign={selectCampaign} setCampaignState={setCampaignState} /> */}



        {/* CANDIDATES */}

        {/* <CandidatesSection
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
        /> */}
      </ScrollView>

      {/* MODAL */}

      {/* <CandidateDeliveryModal
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
      /> */}
    </SafeAreaView>
  );
}