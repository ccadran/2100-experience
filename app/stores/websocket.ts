export const useWebSocket = defineStore("useWebSocket", () => {
  const isConnected = ref<boolean>(false);
  const isRoomFull = ref<boolean>(false);
  const roomId = ref<string | null>(null);

  function setRoomId(id: string) {
    roomId.value = id;
  }

  return { isConnected, isRoomFull, roomId, setRoomId };
});
