<template>
  <div class="flex flex-col gap-5">
    <span class="text-indigo-600 font-bold text-2xl">Dashboard</span>
    <Filters
      :rooms="rooms"
      :types="types"
      :statuses="statuses"
      :filter="filter"
      @set-filter="onSetFilter"/>
    <CardGrid :entities="entities" />
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"
import CardGrid from "@/components/ui/CardGrid.vue"
import Filters from "@/components/dashboard/Filters.vue"

export default {
  name: "Dashboard",
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
    }
  },
  components: {
    CardGrid,
    Filters,
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
      console.log("filter", this.filter)
      this.getEntities({
        room: this.filter.room,
        type: this.filter.type,
        status: this.filter.status,
      })
    },
  },
}
</script>
