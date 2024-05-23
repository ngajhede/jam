export default defineNuxtRouteMiddleware(async () => {
  const { user } = useAuth();
  if (!user.value) return navigateTo("/login");
});
