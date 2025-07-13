import { create } from "zustand";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set, get) => ({
    chatId: null,
    receiver: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId, receiver) => { 
        const currentUser = useUserStore.getState().user;
        const isCurrentUserBlocked = (receiver.blocked || []).includes(currentUser.id);
        const isReceiverBlocked = (currentUser.blocked || []).includes(receiver.id);
        
        // Always set the chat - don't block access to the chat interface
        set({ chatId, receiver, isCurrentUserBlocked, isReceiverBlocked });
    },
    changeBlock: () => {
        const currentUser = useUserStore.getState().user;
        const { receiver } = get();
        
        if (currentUser && receiver) {
            const isCurrentUserBlocked = (receiver.blocked || []).includes(currentUser.id);
            const isReceiverBlocked = (currentUser.blocked || []).includes(receiver.id);
            
            set({ isCurrentUserBlocked, isReceiverBlocked });
        }
    },
    refreshBlockingStates: () => {
        const currentUser = useUserStore.getState().user;
        const { receiver } = get();
        
        if (currentUser && receiver) {
            const isCurrentUserBlocked = (receiver.blocked || []).includes(currentUser.id);
            const isReceiverBlocked = (currentUser.blocked || []).includes(receiver.id);
            
            set({ isCurrentUserBlocked, isReceiverBlocked });
        }
    }
}));