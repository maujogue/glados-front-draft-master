<template>
  <div class="flex flex-col gap-5">
    <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
    <Filters
      :rooms="rooms"
      :types="types"
      :statuses="statuses"
      :filter="filter"
      @set-filter="onSetFilter"/>
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
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"
import CardGrid from "@/components/ui/CardGrid.vue"
import Filters from "@/components/dashboard/Filters.vue"
import EntityEditModal from "@/components/ui/EntityEditModal.vue"

export default {
  name: "Dashboard",
  components: {
    CardGrid,
    Filters,
    EntityEditModal,
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
  },
}
</script>
