export default defineNuxtRouteMiddleware(async () => {
  const { user } = useAuth();
  const data = await useRequestFetch()("/api/user");
  if (data) {
    user.value = data;
  }
});
