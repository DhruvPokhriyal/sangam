import { create } from "zustand";
import { useUserStore } from "./useUserStore";

export const useChatStore = create((set) => ({
    chatId: null,
    receiver: null,
    isCurrentUserBlocked: false,
    isReceiverBlocked: false,
    changeChat: (chatId, receiver) => { 
        const currentUser = useUserStore.getState().user;
        const isCurrentUserBlocked = (receiver.blocked || []).includes(currentUser.id);
        const isReceiverBlocked = (currentUser.blocked || []).includes(receiver.id);
        if (isCurrentUserBlocked || isReceiverBlocked) {
            set({ chatId: null, receiver: null, isCurrentUserBlocked, isReceiverBlocked });
        } else {
            set({ chatId, receiver, isCurrentUserBlocked, isReceiverBlocked });
        }
    },
    changeBlock: ()=> set(state => ({...state, isReceiverBlocked: !state.isReceiverBlocked}))
}));