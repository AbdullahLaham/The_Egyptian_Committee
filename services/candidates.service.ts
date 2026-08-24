// // services/deliveries.service.ts

// import { api } from "./api";

// export const getCampaignCandidates = async ({
//   page = 1,
//   campaignId,
//   search = "",
// }: {
//   page?: number;
//   campaignId: number;
//   search?: string;
// }) => {
//   const response = await api.get(
//     "/candidates",
//     {
//       params: {
//         page,
//         type: campaignId,
//         per_page: 4,
//         search,
//       },
//     }
//   );

//   return response.data.candidates;
// };

// export const updateCandidateStatus =
//   async ({
//     candidateId,
//     status,
//   }: {
//     candidateId: number;
//     status: string;
//   }) => {

//     console.log(status, 'eeeeeeeeeeeeeeeeeeeeeeeeeee')

//     const nextStatus = "مستلم";
//       // status === "مستلم"
//       //   ? "مرشح"
//       //   : "مستلم";



//         console.log("Updating candidate ID:", candidateId);
//         console.log("Current status:", status);
//         console.log("Next status:", nextStatus);
//     // const response =
//     //   await api.put(
//     //     `/candidates/${candidateId}`,
//     //     {
//     //       status: nextStatus,
//     //     }
//     //   );

//     //   console.log("Updated candidate status:", response.data);

//     // return response.data;
//   };









// services/candidates.service.ts

// import { api } from "./api";
// import { CandidateStatus } from "@/constants/candidateStatus";

// export const getCampaignCandidates = async ({
//   page = 1,
//   campaignId,
//   search = "",
// }: {
//   page?: number;
//   campaignId: number;
//   search?: string;
// }) => {
//   const response = await api.get("/candidates", {
//     params: {
//       page,
//       type: campaignId,
//       per_page: 4,
//       search,
//     },
//   });

//   return response.data.candidates;
// };

// export const updateCandidateStatus = async ({
//   candidateId,
//   status,
// }: {
//   candidateId: number;
//   status: CandidateStatus;
// }) => {
//   const formData = new FormData();
//   formData.append("status", status);
//   formData.append("_method", "PUT");

//    const response = await api.post(
//     `/candidates/${candidateId}`,
//     formData,
//     {
//       headers: {
//         "Accept": "application/json",
//         // "Content-Type": "multipart/form-data",
//       },
//     }
//   );





//   // const response = await api.put(
//   //   `/candidates/${candidateId}`,
//   //   {
//   //     status,
//   //   }
//   // );

//   return response.data;
// };


























// services/candidates.service.ts

import { api } from "./api";
import { CandidateStatus } from "@/constants/candidateStatus";

export const getCampaignCandidates = async ({
  page = 1,
  campaignId,
  search = "",
}: {
  page?: number;
  campaignId: number;
  search?: string;
}) => {
  const response = await api.get("/candidates", {
    params: {
      page,
      type: campaignId,
      per_page: 4,
      search,
    },
  });


  console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", response.data.candidates)

  return response.data.candidates;
};

export const updateCandidateStatus = async ({
  candidateId,
  status,
  imageUri,
}: {
  candidateId: number;
  status: CandidateStatus;
  imageUri?: string | null;
}) => {
  const formData = new FormData();

  formData.append("status", status);

  

  /* OPTIONAL IMAGE */

  if (imageUri) {
    console.log("Processing image URI:", imageUri);
    const fileName =
      imageUri.split("/").pop() ||
      `candidate-${candidateId}.jpg`;

    const match = /\.(\w+)$/.exec(fileName);

    const fileType = match
      ? `image/${match[1]}`
      : "image/jpeg";


      console.log("Extracted file name:", fileName);
      console.log("Determined file type:", fileType);
      console.log("Image URI:", imageUri);

    formData.append("img", {
      uri: imageUri,
      name: fileName,
      type: fileType,
    } as any);
  }

  formData.append("_method", "put");


  
  console.log("Updating candidate ID:", candidateId);
  console.log("Current status:", status);
  console.log("Image URI:", imageUri);

  try {

    const response = await api.post(
    `/candidates/${candidateId}`,
    formData,
    {
      headers: {
        Accept: "application/json",
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;

  } catch (error: any) {
  console.log(
    "FULL ERROR:",
    JSON.stringify(
      error?.response?.data,
      null,
      2
    )
  );

  console.log(
    "STATUS:",
    error?.response?.status
  );

  console.log(
    "HEADERS:",
    error?.response?.headers
  );

  console.log(
    "MESSAGE:",
    error?.message
  );

  console.log(
    "REQUEST:",
    error?.request
  );
}
};































































// services/candidates.service.ts

// import { api } from "./api";

// import { CandidateStatus } from "@/constants/candidateStatus";

// export const getCampaignCandidates =
//   async ({
//     page = 1,
//     campaignId,
//     search = "",
//   }: {
//     page?: number;
//     campaignId: number;
//     search?: string;
//   }) => {
//     const response =
//       await api.get(
//         "/candidates",
//         {
//           params: {
//             page,
//             type: campaignId,
//             per_page: 4,
//             search,
//           },
//         }
//       );

//     return response.data
//       .candidates;
//   };

// export const updateCandidateStatus =
//   async ({
//     candidateId,
//     status,
//     image,
//   }: {
//     candidateId: number;
//     status: CandidateStatus;
//     image?: any;
//   }) => {
//     const formData =
//       new FormData();

//     formData.append(
//       "status",
//       status
//     );

//     /* OPTIONAL IMAGE */

//     if (image?.uri) {
//       formData.append(
//         "img",
//         {
//           uri: image.uri,
//           name:
//             "candidate-id.jpg",
//           type: "image/jpeg",
//         } as any
//       );
//       formData.append("_method", "PUT");
//     }

//     const response =
//       await api.post(
//         `/candidates/${candidateId}`,
//         formData,
//         {
//           headers: {
//             "Content-Type":
//               "multipart/form-data",
//           },
//         }
//       );

//     return response.data;
//   };

  