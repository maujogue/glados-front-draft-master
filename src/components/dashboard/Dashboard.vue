<template>
  <div class="flex flex-col gap-5">
    <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>

    <!-- Responsive Flex Layout -->
    <div class="flex flex-wrap md:flex-nowrap gap-4">
      <div class="flex-[2] min-w-0">
        <Filters
          :rooms="rooms"
          :types="types"
          :statuses="statuses"
          :filter="filter"
          @set-filter="onSetFilter"
          @manage-rooms="showRoomModal = true"/>
      </div>
      <div class="flex-[1] min-w-0">
        <TTS_speaker :filter="filter" />
      </div>
    </div>

    <CardGrid
      :entities="entities"
      @edit="onEditEntity" />

    <EntityEditModal
      v-if="selectedEntity"
      :entity="selectedEntity"
      :rooms="rooms"
      :types="types"
      :visible="!!selectedEntity"
      @close="selectedEntity = null"
      @save="onSaveEntityEdit"/>

    <RoomEditModal
      v-if="showRoomModal"
      :visible="showRoomModal"
      :rooms="rooms"
      @close="showRoomModal = false"
      @save="onSaveRoom"
      @delete="onDeleteRoom"
      @update="onUpdateRoom"/>
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"
import CardGrid from "@/components/ui/CardGrid.vue"
import Filters from "@/components/dashboard/Filters.vue"
import EntityEditModal from "@/components/ui/EntityEditModal.vue"
import RoomEditModal from "@/components/ui/RoomEditModal.vue"
import TTS_speaker from "@/components/dashboard/TTS_speaker.vue"

export default {
  name: "Dashboard",
  components: {
    TTS_speaker,
    CardGrid,
    Filters,
    EntityEditModal,
    RoomEditModal,
  },
  created() {
    this.fetchFilters()
    this.getEntities()
  },
  data() {
    return {
      entities: [],
      isLoading: false,
      isError: false,
      rooms: [],
      types: [],
      statuses: ["on", "off", "unavailable"],
      filter: {
        room: "all",
        type: "all",
        status: "all",
      },
      selectedEntity: null,
      showRoomModal: false,
    }
  },
  methods: {
    async fetchFilters() {
      try {
        const [roomRes, typeRes] = await Promise.all([
          coreApi.glados.getRooms(),
          coreApi.glados.getTypes(),
        ])
        this.rooms = roomRes.rooms || []
        this.types = typeRes.types || []
      } catch (e) {
        console.error(e)
      }
    },
    async getEntities(params = {}) {
      this.isLoading = true
      try {
        const entities = await coreApi.glados.getEntities(params)
        this.entities = entities
      } catch (error) {
        console.error(error)
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    onSetFilter({ key, value }) {
      this.filter[key] = value
      this.getEntities({
        room: this.filter.room,
        type: this.filter.type,
        status: this.filter.status,
      })
    },
    async onEditEntity(entityId) {
      try {
        const entity = this.entities.find((e) => e.id === entityId)
        if (entity) {
          this.selectedEntity = entity
        }
      } catch (e) {
        console.error(e)
      }
    },
    async onSaveEntityEdit(form) {
      try {
        await coreApi.glados.updateEntity(this.selectedEntity.id, form)
        this.selectedEntity = null
        await this.getEntities({
          room: this.filter.room,
          type: this.filter.type,
          status: this.filter.status,
        })
      } catch (e) {
        console.error(e)
      }
    },
    async onSaveRoom(room) {
      try {
        await coreApi.glados.addRoom(room)
        this.fetchFilters()
      } catch (e) {
        console.error(e)
      }
    },
    async onDeleteRoom(roomId) {
      try {
        await coreApi.glados.deleteRoom(roomId)
        this.fetchFilters()
      } catch (e) {
        console.error(e)
      }
    },
    async onUpdateRoom({ id, name }) {
      try {
        await coreApi.glados.updateRoom(id, { name })
        this.fetchFilters()
      } catch (e) {
        console.error(e)
      }
    },
  },
}
</script>
