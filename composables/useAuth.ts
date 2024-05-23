import type { User } from "lucia";

export const useAuth = () => {
  const user = useState<User | null>("user", () => null);

  const login = async () => {
    await navigateTo("/login/github");
  };

  const logout = async () => {
    await useFetch("/api/logout", {
      method: "POST",
    });
    await navigateTo("/login");
  };

  return {
    user,
    login,
    logout,
  };
};
