import { useUserStore } from "./useUserStore";

export const useAuth = () => {
    const { user, loading, error, signup, login, logout } = useUserStore();
    return { user, loading, error, signup, login, logout };
}