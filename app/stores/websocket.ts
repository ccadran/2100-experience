export const useWebSocket = defineStore("useWebSocket", () => {
  const isConnected = ref<boolean>(false);
  const isRoomFull = ref<boolean>(false);

  return { isConnected, isRoomFull };
});
