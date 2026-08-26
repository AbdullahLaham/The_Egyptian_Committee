// import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { SafeAreaView } from 'react-native-safe-area-context'
// import { getCampaignCandidates, updateCandidateStatus } from '@/services/candidates.service';
// import { fetchCampaigns, loadSelectedCampaign, selectCampaign } from '@/store/campaign.store';
// import CandidatesSection from '@/components/home/CandidatesSection';
// import CandidateDeliveryModal from '@/components/home/CandidateDeliveryModal';

// const Campaigns = () => {
//    const [campaignState, setCampaignState] =
//       useState({
//         campaigns: [],
//         selectedCampaign: null,
//         loading: false,
//         error: null,
//       });


//       /* ================= CANDIDATES ================= */

//   const [candidates, setCandidates] =
//     useState<any[]>([]);

//   const [candidatesLoading, setCandidatesLoading] =
//     useState(false);

//   const [candidatesPage, setCandidatesPage] =
//     useState(1);

//   const [hasMoreCandidates, setHasMoreCandidates] =
//     useState(true);

//   const [totalCandidates, setTotalCandidates] =
//     useState(0);





//  /* ================= MODAL ================= */



//     const [
//         selectedCandidate,
//         setSelectedCandidate,
//       ] = useState<any>(null);
    
//       const [
//         deliveryModalVisible,
//         setDeliveryModalVisible,
//       ] = useState(false);
    
//       const [
//         updatingCandidate,
//         setUpdatingCandidate,
//       ] = useState(false);
    
//       /* ================= SEARCH ================= */
    
//       // const [debouncedSearch] =
//       //   useDebounce(search, 2000); // search
    
//       /* ================= FETCH CANDIDATES ================= */
    
//       const fetchCandidates = async ({
//         page = 1,
//         reset = false,
//         query = "",
//       }: any) => {
//         try {
//           if (
//             !campaignState.selectedCampaign
//           )
//             return;
    
//           setCandidatesLoading(true);
    
//           const response =
//             await getCampaignCandidates({
//               page,
//               campaignId:
//                 campaignState.selectedCampaign?.id,
//               search: query,
//             });
    
//           const newData =
//             response?.data || [];
    
//           setCandidates((prev) =>
//             reset
//               ? newData
//               : [...prev, ...newData]
//           );
    
//           setHasMoreCandidates(
//             response.current_page <
//             response.last_page
//           );
    
//           setCandidatesPage(
//             response.current_page
//           );
    
//           setTotalCandidates(
//             response.total
//           );
//         } catch (error) {
//           console.log(error);
//         } finally {
//           setCandidatesLoading(false);
//         }
//       };
    
//       /* ================= UPDATE STATUS ================= */
    
//       // const handleDeliverCandidate =
//       //   async () => {
//       //     try {
//       //       if (!selectedCandidate)
//       //         return;
    
//       //       setUpdatingCandidate(true);
    
//       //       // const nextStatus =
//       //       //   selectedCandidate.status ===
//       //       //   "مستلم"
//       //       //     ? "مرشح"
//       //       //     : "مستلم";
    
//       //       const nextStatus = "مستلم";
    
//       //       await updateCandidateStatus({
//       //         candidateId:
//       //           selectedCandidate.id,
    
//       //         status: nextStatus,
//       //       });
    
//       //       /* UPDATE UI */
    
//       //       setCandidates((prev) =>
//       //         prev.map((item) =>
//       //           item.id ===
//       //           selectedCandidate.id
//       //             ? {
//       //                 ...item,
//       //                 status: nextStatus,
//       //               }
//       //             : item
//       //         )
//       //       );
    
//       //       setSelectedCandidate(
//       //         (prev: any) => ({
//       //           ...prev,
//       //           status: nextStatus,
//       //         })
//       //       );
//       //     } catch (error) {
//       //       console.log(error);
//       //     } finally {
//       //       setUpdatingCandidate(false);
//       //     }
//       //   };
    
    
    
//       //   const handleDeliverCandidate = async () => {
//       //   try {
//       //     if (!selectedCandidate) return;
    
//       //     setUpdatingCandidate(true);
    
//       //     const nextStatus = toggleStatus(
//       //       selectedCandidate.status
//       //     );
    
//       //     await updateCandidateStatus({
//       //       candidateId: selectedCandidate.id,
//       //       status: nextStatus,
//       //     });
    
//       //     // Update UI
//       //     setCandidates((prev) =>
//       //       prev.map((item) =>
//       //         item.id === selectedCandidate.id
//       //           ? { ...item, status: nextStatus }
//       //           : item
//       //       )
//       //     );
    
//       //     setSelectedCandidate((prev: any) => ({
//       //       ...prev,
//       //       status: nextStatus,
//       //     }));
//       //   } catch (error) {
//       //     console.log(error);
//       //   } finally {
//       //     setUpdatingCandidate(false);
//       //   }
//       // };
    
    
//       const handleDeliverCandidate =
//         async (image: any) => {
//           try {
//             if (!selectedCandidate)
//               return;
    
//             setUpdatingCandidate(true);
    
//             const nextStatus =
//               selectedCandidate.status ===
//                 "مستلم"
//                 ? "مرشح"
//                 : "مستلم";
  
    
//             const res = await updateCandidateStatus({
//               candidateId:
//                 selectedCandidate.id,
    
//               status: nextStatus,
    
//               // image,
//             });
    
//             /* UPDATE CANDIDATES */
    
//             setCandidates((prev) =>
//               prev.map((item) =>
//                 item.id ===
//                   selectedCandidate.id
//                   ? {
//                     ...item,
//                     status: nextStatus,
//                   }
//                   : item
//               )
//             );
    
//             /* UPDATE MODAL */
    
//             setSelectedCandidate(
//               (prev: any) => ({
//                 ...prev,
//                 status: nextStatus,
//               })
//             );
    
//             return res;
//           } catch (error) {
//             console.log(error);
//           } finally {
//             setUpdatingCandidate(false);
//           }
//         };
    
//       /* ================= LOAD MORE ================= */
    
//       const loadMoreCandidates = () => {
//         if (
//           candidatesLoading ||
//           !hasMoreCandidates
//         )
//           return;
    
//         fetchCandidates({
//           page: candidatesPage + 1,
//           // query: debouncedSearch,
//         });
//       };
    
//       /* ================= EFFECTS ================= */
    
//       useEffect(() => {
//         fetchCampaigns(setCampaignState);
    
//         loadSelectedCampaign(
//           setCampaignState
//         );
//       }, []);
    
//       useEffect(() => {
//         if (
//           !campaignState.selectedCampaign
//         )
//           return;
    
//         setCandidates([]);
    
//         setCandidatesPage(1);
    
//         fetchCandidates({
//           page: 1,
//           reset: true,
//           // query: debouncedSearch,
//         });
//       }, [
//         campaignState.selectedCampaign,
//         // debouncedSearch,
//       ]);

//   return (
//     <SafeAreaView className="flex-1 bg-brand-secondary">
//       <ScrollView>
//         <View className="mt-8">
//           <View className="px-5 mb-5">
//             <Text className="text-brand-white text-2xl font-extrabold">
//               الحملات المتوفرة
//             </Text>
//           </View>

//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={
//               false
//             }
//             contentContainerStyle={{
//               gap: 12,
//               paddingHorizontal: 20,
//             }}
//           >
//             {campaignState.campaigns.map(
//               (campaign: any) => {
//                 const isSelected =
//                   campaignState
//                     .selectedCampaign
//                     ?.id === campaign.id;

//                 return (
//                   <Pressable
//                     key={campaign.id}
//                     onPress={() =>
//                       selectCampaign(
//                         campaign,
//                         setCampaignState
//                       )
//                     }
//                     className={`px-6 py-5 rounded-[26px] border ${isSelected
//                         ? "bg-brand-primary border-brand-primary"
//                         : "bg-brand-white/5 border-brand-white/10"
//                       }`}
//                   >
//                     <Text
//                       className={`font-extrabold text-base ${isSelected
//                           ? "text-white"
//                           : "text-brand-white"
//                         }`}
//                     >
//                       {campaign.name}
//                     </Text>

//                     <Text
//                       className={`mt-2 ${isSelected
//                           ? "text-white/80"
//                           : "text-gray-400"
//                         }`}
//                     >
//                       {campaign.type}
//                     </Text>
//                   </Pressable>
//                 );
//               }
//             )}
//           </ScrollView>
//         </View>

//         <CandidatesSection
//           candidates={candidates}
//           loading={candidatesLoading}
//           hasMore={hasMoreCandidates}
//           currentPage={candidatesPage}
//           total={totalCandidates}
//           selectedCampaignName={
//             campaignState
//               .selectedCampaign?.name
//           }
//           onLoadMore={
//             loadMoreCandidates
//           }
//           onPressItem={(
//             candidate: any
//           ) => {
//             setSelectedCandidate(
//               candidate
//             );

//             setDeliveryModalVisible(
//               true
//             );
//           }}
//         />
//       </ScrollView>



//       <CandidateDeliveryModal
//               visible={deliveryModalVisible}
//               candidate={selectedCandidate}
//               loading={updatingCandidate}
//               onClose={() => {
//                 setDeliveryModalVisible(
//                   false
//                 );
      
//                 setSelectedCandidate(
//                   null
//                 );
//               }}
//               onConfirm={
//                 handleDeliverCandidate
//               }
//             />




//     </SafeAreaView>
//   )
// }

// export default Campaigns

// const styles = StyleSheet.create({})


































import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCampaignCandidates, updateCandidateStatus } from "@/services/candidates.service";
import { fetchCampaigns, loadSelectedCampaign, selectCampaign } from "@/store/campaign.store";
import CandidatesSection from "@/components/home/CandidatesSection";
import CandidateDeliveryModal from "@/components/home/CandidateDeliveryModal";
import ScreenHeader from "@/components/ScreenHeader";
import { useTheme } from "@/context/ThemeContext";

const Campaigns = () => {
  const { colorScheme } = useTheme();

  const [campaignState, setCampaignState] = useState({
    campaigns: [],
    selectedCampaign: null,
    loading: false,
    error: null,
  });

  /* ================= CANDIDATES ================= */
  const [candidates, setCandidates] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(false);
  const [candidatesPage, setCandidatesPage] = useState(1);
  const [hasMoreCandidates, setHasMoreCandidates] = useState(true);
  const [totalCandidates, setTotalCandidates] = useState(0);

  /* ================= MODAL ================= */
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);
  const [updatingCandidate, setUpdatingCandidate] = useState(false);

  /* ================= FETCH CANDIDATES ================= */
  const fetchCandidates = async ({
    page = 1,
    reset = false,
    query = "",
  }: any) => {
    try {
      if (!campaignState.selectedCampaign) return;

      setCandidatesLoading(true);

      const response = await getCampaignCandidates({
        page,
        campaignId: campaignState.selectedCampaign?.id,
        search: query,
      });

      const newData = response?.data || [];

      setCandidates((prev) => (reset ? newData : [...prev, ...newData]));
      setHasMoreCandidates(response.current_page < response.last_page);
      setCandidatesPage(response.current_page);
      setTotalCandidates(response.total);
    } catch (error) {
      console.log(error);
    } finally {
      setCandidatesLoading(false);
    }
  };

  /* ================= UPDATE STATUS ================= */
  const handleDeliverCandidate = async (image: any) => {
    try {
      if (!selectedCandidate) return;

      setUpdatingCandidate(true);

      const nextStatus =
        selectedCandidate.status === "مستلم" ? "مرشح" : "مستلم";

      const res = await updateCandidateStatus({
        candidateId: selectedCandidate.id,
        status: nextStatus,
        // image,
      });

      /* UPDATE CANDIDATES */
      setCandidates((prev) =>
        prev.map((item) =>
          item.id === selectedCandidate.id
            ? { ...item, status: nextStatus }
            : item
        )
      );

      /* UPDATE MODAL */
      setSelectedCandidate((prev: any) => ({
        ...prev,
        status: nextStatus,
      }));

      return res;
    } catch (error) {
      console.log(error);
    } finally {
      setUpdatingCandidate(false);
    }
  };

  /* ================= LOAD MORE ================= */
  const loadMoreCandidates = () => {
    if (candidatesLoading || !hasMoreCandidates) return;

    fetchCandidates({
      page: candidatesPage + 1,
    });
  };

  /* ================= EFFECTS ================= */
  useEffect(() => {
    fetchCampaigns(setCampaignState);
    loadSelectedCampaign(setCampaignState);
  }, []);

  useEffect(() => {
    if (!campaignState.selectedCampaign) return;

    setCandidates([]);
    setCandidatesPage(1);

    fetchCandidates({
      page: 1,
      reset: true,
    });
  }, [campaignState.selectedCampaign]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-[#0F0F0F]">
      <StatusBar barStyle={colorScheme === "dark" ? "light-content" : "dark-content"} />

      {/* ScreenHeader الموحد للثيم والتنقل */}
      <ScreenHeader title="الحملات والترشيحات" iconName="flag-outline" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mt-4">
          <View className="px-5 mb-3">
            <Text className="text-gray-900 dark:text-white text-lg font-extrabold">
              الحملات المتوفرة
            </Text>
          </View>

          {/* قائمة الحملات الأفقية */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 12,
              paddingHorizontal: 20,
            }}
          >
            {campaignState.campaigns.map((campaign: any) => {
              const isSelected =
                campaignState.selectedCampaign?.id === campaign.id;

              return (
                <Pressable
                  key={campaign.id}
                  onPress={() =>
                    selectCampaign(campaign, setCampaignState)
                  }
                  className={`px-5 py-4 rounded-2xl border ${
                    isSelected
                      ? "bg-[#C09A3E] border-[#C09A3E]"
                      : "bg-white dark:bg-[#1A1A1A] border-gray-200 dark:border-white/10"
                  }`}
                >
                  <Text
                    className={`font-extrabold text-sm ${
                      isSelected
                        ? "text-black"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {campaign.name}
                  </Text>

                  <Text
                    className={`mt-1 text-xs font-semibold ${
                      isSelected
                        ? "text-black/70"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {campaign.type}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* قسم المرشحين */}
        <CandidatesSection
          candidates={candidates}
          loading={candidatesLoading}
          hasMore={hasMoreCandidates}
          currentPage={candidatesPage}
          total={totalCandidates}
          selectedCampaignName={campaignState.selectedCampaign?.name}
          onLoadMore={loadMoreCandidates}
          onPressItem={(candidate: any) => {
            setSelectedCandidate(candidate);
            setDeliveryModalVisible(true);
          }}
        />
      </ScrollView>

      {/* مودال التسليم والتأكيد */}
      <CandidateDeliveryModal
        visible={deliveryModalVisible}
        candidate={selectedCandidate}
        loading={updatingCandidate}
        onClose={() => {
          setDeliveryModalVisible(false);
          setSelectedCandidate(null);
        }}
        onConfirm={handleDeliverCandidate}
      />
    </SafeAreaView>
  );
};

export default Campaigns;