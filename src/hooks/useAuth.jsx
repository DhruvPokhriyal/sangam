import { useUserStore } from "./useUserStore";

export const useAuth = () => {
    const { user, loading, signup, login, logout } = useUserStore();
    return { user, loading, signup, login, logout };
}