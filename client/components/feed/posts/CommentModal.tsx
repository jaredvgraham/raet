// import {
//   View,
//   Text,
//   KeyboardAvoidingView,
//   Platform,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   Keyboard,
// } from "react-native";
// import React from "react";
// import { Image } from "expo-image";
// import { formatDistanceToNow } from "date-fns";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Comment } from "@/types";

// type CommentModalProps = {
//   keyboardVisible: boolean;
//   comments: Comment[];
//   handleSubmitComment: (postId: string, comment: string) => void;
//   comment: string;
//   setComment: React.Dispatch<React.SetStateAction<string>>;
//   selectedPostId: string;
// };

// const CommentModal = ({
//   keyboardVisible,
//   comments,

//   comment,
//   setComment,
// }: CommentModalProps) => {
//   const insets = useSafeAreaInsets();

//   const handleSubmitComment = async (postId: string, commentText: string) => {
//     try {
//       if (!commentText.trim()) return;
//       const response = await authFetch(`/api/post/${postId}/comment`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: commentText }),
//       });

//       const data = await response.json();
//       console.log("Comment posted:", data);

//       // Refresh comments after posting
//       setPosts((prev) =>
//         prev.map((post) => {
//           if (post._id === postId) {
//             return {
//               ...post,
//               comments: post.commentCount + 1,
//             };
//           }
//           return post;
//         })
//       );

//       setComment("");
//       setComments((prev: Comment[]) => [data.comment, ...prev]);
//     } catch (error) {
//       console.error("Error posting comment:", error);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === "ios" ? "padding" : "height"}
//       keyboardVerticalOffset={80}
//       style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
//       className="absolute bottom-0 left-0 right-0 top-40 bg-white z-50"
//     >
//       <View
//         className="flex-1 pt-4 px-1"
//         style={[keyboardVisible && { paddingBottom: insets.bottom }]}
//       >
//         <FlatList
//           data={comments}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View className="flex-row items-start gap-3 mb-4 px-1">
//               {/* Profile Image */}
//               <Image
//                 source={{ uri: item.userAvatar }}
//                 className="w-9 h-9 rounded-full"
//               />

//               {/* Comment Content */}
//               <View className="flex-1 border-b border-gray-200 pb-2">
//                 {/* Name & Timestamp */}
//                 <View className="flex-row items-center justify-between gap-2">
//                   <Text className="text-sm font-semibold text-gray-500">
//                     {item.userName}
//                   </Text>
//                   <Text className="text-xs text-gray-400 text-right">
//                     {formatDistanceToNow(new Date(item.createdAt), {
//                       addSuffix: false,
//                     })}{" "}
//                     ago
//                   </Text>
//                 </View>

//                 {/* Comment Text */}
//                 <Text className="text-sm text-gray-800 mt-0.5">
//                   {item.text}
//                 </Text>
//               </View>
//             </View>
//           )}
//           contentContainerStyle={{ paddingBottom: 80 }}
//         />

//         <View className="flex-row items-center p-4 border-t border-gray-200 bg-white">
//           <TextInput
//             value={comment}
//             onChangeText={setComment}
//             placeholder="Add a comment..."
//             className="flex-1 border border-gray-300 rounded-full px-3 py-2"
//           />
//           <TouchableOpacity
//             onPress={() => {
//               Keyboard.dismiss();
//               handleSubmitComment;
//             }}
//             className="ml-2 bg-blue-500 px-4 py-2 rounded-full"
//           >
//             <Text className="text-white">Post</Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </KeyboardAvoidingView>
//   );
// };

// export default CommentModal;
