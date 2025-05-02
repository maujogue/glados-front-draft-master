import coreApiClient from "@/providers/core-api/CoreApi"

export default {
  getEntities(params = {}) {
    return coreApiClient.sendRequest("get", "/entities", params)
  },
  getEntitiesTTS(params = {}) {
    return coreApiClient.sendRequest("get", "/entities/tts", params)
  },
  getEntity(id) {
    return coreApiClient.sendRequest("get", `/entities/${id}`)
  },
  updateEntity(id, data) {
    return coreApiClient.sendRequest("patch", `/entities/${id}`, data)
  },
  updateEntityStatus(id, status) {
    return coreApiClient.sendRequest("patch", "/entities", {
      id,
      status,
    })
  },
  updateEntityValue(id, value) {
    return coreApiClient.sendRequest("patch", "/entities", {
      id,
      value,
    })
  },
  getRooms() {
    return coreApiClient.sendRequest("get", "/rooms", {})
  },
  addRoom(data) {
    return coreApiClient.sendRequest("post", "/room", data)
  },
  deleteRoom(id) {
    return coreApiClient.sendRequest("delete", `/room/${id}`)
  },
  updateRoom(id, data) {
    return coreApiClient.sendRequest("patch", `/room/${id}`, data)
  },
  getTypes() {
    return coreApiClient.sendRequest("get", "/entities/types", {})
  },
}
