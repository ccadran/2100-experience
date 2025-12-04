export const useWebSocket = defineStore("useWebSocket", () => {
  const isConnected = ref<boolean>(false);

  return { isConnected };
});
