import coreApiClient from "@/providers/core-api/CoreApi"

export default {
  getEntities(params = {}) {
    console.log(params)
    return coreApiClient.sendRequest("get", "/entities", params)
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
  getTypes() {
    return coreApiClient.sendRequest("get", "/types", {})
  },
}
