import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";

import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";

export default function CandidatesSection({
  candidates,
  loading,
  hasMore,
  currentPage,
  total,
  selectedCampaignName,
  onLoadMore,
  onPressItem,
}: any) {
  const getStatusConfig = (
  status: string
) => {
  switch (status) {
    case "مستلم":
      return {
        bg: "bg-green-500/10",
        text: "text-green-400",
        icon: "check-circle",
      };

    case "مرشح":
      return {
        bg: "bg-yellow-500/10",
        text: "text-yellow-400",
        icon: "schedule",
      };

    case "فشل":
      return {
        bg: "bg-brand-primary/10",
        text: "text-brand-primary",
        icon: "error-outline",
      };

    default:
      return {
        bg: "bg-brand-white/10",
        text: "text-brand-white",
        icon: "info-outline",
      };
  }
};

  return (
    <View className="px-5 mt-10">
      {/* HEADER */}

      <View className="flex-row items-center justify-between mb-5">
        <View>
          <Text className="text-brand-white text-2xl font-extrabold">
            المرشحون
          </Text>

          <Text className="text-gray-400 mt-1">
            إجمالي المرشحين: {total}
          </Text>
        </View>

        {selectedCampaignName && (
          <View className="px-4 py-3 rounded-2xl bg-brand-primary/10 border border-brand-primary/20">
            <Text className="text-brand-primary font-bold">
              {selectedCampaignName}
            </Text>
          </View>
        )}
      </View>

      {/* LIST */}

      <View className="rounded-[32px] overflow-hidden bg-brand-white/5 border border-brand-white/10">
        <FlatList
          data={candidates}
          keyExtractor={(item) =>
            item.id.toString()
          }
          scrollEnabled={false}
          renderItem={({ item }) => {
            const status =
              getStatusConfig(item.status);

            return (
              <Pressable
                onPress={() =>
                  onPressItem?.(item)
                }
                className="px-5 py-5 border-b border-brand-white/5 active:opacity-80"
              >
                <View className="flex-row items-center">
                  <Entypo
                    name="chevron-left"
                    size={22}
                    color="#9CA3AF"
                  />

                  {/* USER INFO */}

                  <View className="flex-1 mr-4">
                    <Text className="text-brand-white text-lg font-extrabold leading-7">
                      {
                        item?.beneficiary
                          ?.full_name
                      }
                    </Text>

                    <View className="flex-row flex-wrap items-center mt-3 gap-3">
                      {/* ID */}

                      <View className="flex-row items-center">
                        <Ionicons
                          name="card-outline"
                          size={15}
                          color="#9CA3AF"
                        />

                        <Text className="text-gray-400 mr-1">
                          {
                            item?.beneficiary
                              ?.ID_number
                          }
                        </Text>
                      </View>

                      {/* PHONE */}

                      <View className="flex-row items-center">
                        <Ionicons
                          name="call-outline"
                          size={15}
                          color="#9CA3AF"
                        />

                        <Text className="text-gray-400 mr-1">
                          {
                            item?.beneficiary
                              ?.Phone_Number
                          }
                        </Text>
                      </View>

                      {/* MEMBERS */}

                      <View className="flex-row items-center">
                        <FontAwesome5
                          name="users"
                          size={13}
                          color="#9CA3AF"
                        />

                        <Text className="text-gray-400 mr-1">
                          {
                            item?.beneficiary
                              ?.members_count
                          }{" "}
                          أفراد
                        </Text>
                      </View>
                    </View>

                    {/* CAMPAIGN */}

                    <View className="mt-4 self-start px-3 py-2 rounded-full bg-brand-secondary/20">
                      <Text className="text-gray-300 text-xs font-bold">
                        {
                          item?.campaign
                            ?.name
                        }
                      </Text>
                    </View>
                  </View>

                  {/* STATUS */}

                  <View className="items-end">
                    <Text className="text-gray-500 text-xs mb-3">
                      {new Date(
                        item.created_at
                      ).toLocaleDateString(
                        "ar-EG"
                      )}
                    </Text>

                    <View
                      className={`flex-row items-center px-3 py-2 rounded-full ${status.bg}`}
                    >
                      <MaterialIcons
                        name={
                          status.icon as any
                        }
                        size={15}
                        color="white"
                      />

                      <Text
                        className={`${status.text} font-bold mr-2`}
                      >
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  {/* AVATAR */}
{/* 
                  <View className="w-14 h-14 rounded-2xl bg-brand-white/10 items-center justify-center mr-4 border border-brand-white/10">
                    <Ionicons
                      name="person"
                      size={26}
                      color="#D1D5DB"
                    />
                  </View> */}
                </View>
              </Pressable>
            );
          }}
          ListFooterComponent={
            <View className="p-5">
              {hasMore ? (
                <Pressable
                  onPress={onLoadMore}
                  disabled={loading}
                  className="bg-brand-primary rounded-2xl py-4 items-center active:opacity-80"
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text className="text-white font-extrabold text-lg">
                      تحميل المزيد
                    </Text>
                  )}
                </Pressable>
              ) : (
                <View className="items-center py-2">
                  <Text className="text-gray-500">
                    تم عرض جميع النتائج
                  </Text>
                </View>
              )}

              <View className="mt-5 flex-row justify-center items-center">
                <View className="px-4 py-2 rounded-full bg-brand-white/5 border border-brand-white/10">
                  <Text className="text-brand-white font-bold">
                    الصفحة {currentPage}
                  </Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            !loading ? (
              <View className="py-16 items-center">
                <View className="w-20 h-20 rounded-full bg-brand-white/5 items-center justify-center mb-5">
                  <Ionicons
                    name="people-outline"
                    size={38}
                    color="#9CA3AF"
                  />
                </View>

                <Text className="text-brand-white text-xl font-bold">
                  لا توجد بيانات
                </Text>

                <Text className="text-gray-400 mt-2 text-center px-10 leading-6">
                  لم يتم العثور على مرشحين
                  ضمن هذه الحملة
                </Text>
              </View>
            ) : (
              <View className="py-16 items-center">
                <ActivityIndicator
                  size="large"
                  color="#fff"
                />

                <Text className="text-gray-400 mt-4">
                  جاري تحميل البيانات...
                </Text>
              </View>
            )
          }
        />
      </View>
    </View>
  );
}