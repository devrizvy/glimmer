import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "../services/apiService";

// Hook for fetching private messages for a specific chat
const fetchPrivateMessages = async (chatId: string) => {
	const response = await messagesApi.getPrivateMessages(chatId);
	return response.data;
};

export const usePrivateMessages = (chatId: string) => {
	const {
		isPending,
		data: messages,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["privateMessages", chatId],
		queryFn: () => fetchPrivateMessages(chatId),
		enabled: !!chatId,
		refetchOnWindowFocus: false,
	});

	return { isPending, messages: messages || [], isError, error, refetch };
};

// Hook for fetching all chats for a user
const fetchUserChats = async (userEmail: string) => {
	const response = await messagesApi.getUserChats(userEmail);
	return response.data;
};

export const useUserChats = (userEmail: string) => {
	const {
		isPending,
		data: chats,
		isError,
		error,
		refetch,
	} = useQuery({
		queryKey: ["userChats", userEmail],
		queryFn: () => fetchUserChats(userEmail),
		enabled: !!userEmail,
		refetchOnWindowFocus: false,
		refetchInterval: 30000, // Refetch every 30 seconds to get new chats
	});

	return { isPending, chats: chats || [], isError, error, refetch };
};
