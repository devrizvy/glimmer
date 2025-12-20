import { useQuery } from "@tanstack/react-query";
import { messagesApi } from "../services/apiService";

const fetchRoomMessages = (roomId: string) => {
	// Use the messages API to get room messages
	return messagesApi.getRoomMessages(roomId).then(res => res.data);
};

const useRoomMessages = (roomId: string) => {
	const {
		isPending,
		data: messages,
		isError,
		error,
	} = useQuery({
		queryKey: ["messages", roomId], // Include roomId in the query key for proper caching
		queryFn: () => fetchRoomMessages(roomId),
		enabled: !!roomId, // Only run the query if roomId exists
		refetchOnWindowFocus: false, // Don't refetch when window gets focus (we'll use sockets)
	});

	return { isPending, messages, isError, error };
};

export default useRoomMessages;
