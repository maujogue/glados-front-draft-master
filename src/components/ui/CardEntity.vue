<template>
  <div
    class="card-entity bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition flex flex-col gap-4 min-h-[170px] relative"
    @click="onEdit">
    <div class="flex items-center justify-between w-full">
      <div class="flex items-center gap-4">
        <span class="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100">
          <component
            :is="iconComponent"
            class="text-indigo-500 w-7 h-7" />
        </span>
        <div>
          <h3 class="font-semibold text-lg leading-tight text-gray-900">
            {{ localEntity.name }}
          </h3>
          <div class="text-xs text-gray-400 capitalize mt-1">
            {{ localEntity.type }}
          </div>
        </div>
      </div>
      <div class="flex items-center">
        <template v-if="showSwitch">
          <template v-if="localEntity.status === 'unavailable'"> </template>
          <template v-else>
            <label
              class="inline-flex items-center cursor-pointer"
              @click.stop>
              <input
                type="checkbox"
                class="sr-only peer"
                :checked="localEntity.status === 'on'"
                @change="toggleStatus"
                :disabled="isLoading"/>
              <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-green-400 transition-all"></div>
              <div class="absolute ml-1 mt-1 w-4 h-4 bg-white rounded-full shadow transform peer-checked:translate-x-5 transition-all"></div>
            </label>
          </template>
        </template>
      </div>
    </div>
    <div
      v-if="showValue"
      class="flex flex-col items-center justify-center w-full mt-2">
      <span class="text-3xl font-extrabold text-gray-800 leading-none">{{
        localEntity.value
      }}</span>
      <!-- Value controls -->
      <template v-if="showValueControl">
        <!-- Light: slider -->
        <input
          v-if="localEntity.type === 'light'"
          type="range"
          min="0"
          max="255"
          step="1"
          v-model="sliderValue"
          @input="onSliderInput"
          @change="onSliderChange"
          class="w-full mt-2 accent-indigo-500"
          @click.stop/>
        <!-- Air conditioner or heater: up/down -->
        <div
          v-else-if="['air_conditioner', 'heater'].includes(localEntity.type)"
          class="flex gap-2 mt-2">
          <button
            @click.stop
            @click="changeValue(-1)"
            :disabled="isLoading || localEntity.value <= 10"
            class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold">
            -
          </button>
          <button
            @click.stop
            @click="changeValue(1)"
            :disabled="isLoading || localEntity.value >= 35"
            class="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300 text-lg font-bold">
            +
          </button>
        </div>
      </template>
    </div>
    <div
      v-else
      class="flex flex-col items-center justify-center w-full mt-2">
      <span :class="['text-2xl font-bold', statusClass]">{{
        localEntity.status
      }}</span>
    </div>
  </div>
</template>

<script>
// Import Lucide icons (or use placeholders if not available)
import {
  LucideLightbulb,
  LucideSnowflake,
  LucideThermometer,
  LucideToggleRight,
  LucideTv,
} from "lucide-vue-next"
import coreApi from "@/providers/core-api"

export default {
  name: "CardEntity",
  props: {
    entity: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: false,
      localEntity: { ...this.entity },
      sliderValue: this.entity.type === "light" ? this.entity.value : 0,
    }
  },
  watch: {
    entity: {
      handler(newVal) {
        this.localEntity = { ...newVal }
        if (newVal.type === "light") {
          this.sliderValue = newVal.value
        }
      },
      deep: true,
    },
  },
  computed: {
    iconComponent() {
      switch (this.localEntity.type) {
        case "sensor":
          return LucideThermometer
        case "light":
          return LucideLightbulb
        case "multimedia":
          return LucideTv
        case "switch":
          return LucideToggleRight
        case "air_conditioner":
          return LucideSnowflake
        default:
          return LucideThermometer
      }
    },
    bgClass() {
      switch (this.localEntity.status) {
        case "on":
          return "bg-green-50 border-green-200"
        case "off":
          return "bg-gray-50 border-gray-200"
        case "unavailable":
          return "bg-red-50 border-red-200"
        default:
          return "bg-white border-gray-200"
      }
    },
    statusClass() {
      switch (this.localEntity.status) {
        case "on":
          return "text-green-600 font-bold"
        case "off":
          return "text-gray-400 font-bold"
        case "unavailable":
          return "text-red-500 font-bold"
        default:
          return ""
      }
    },
    showSwitch() {
      return ["light", "switch", "air_conditioner", "multimedia"].includes(
        this.localEntity.type
      )
    },
    showValue() {
      // Show value if not a switch and value is not null
      return (
        this.localEntity.type !== "switch" && this.localEntity.value !== null
      )
    },
    showValueControl() {
      // Only show controls if device is on and not unavailable
      return (
        this.localEntity.status === "on" &&
        this.localEntity.status !== "unavailable" &&
        ["light", "air_conditioner", "heater"].includes(this.localEntity.type)
      )
    },
  },
  methods: {
    async toggleStatus() {
      if (this.localEntity.status === "unavailable") return
      this.isLoading = true
      const newStatus = this.localEntity.status === "on" ? "off" : "on"
      try {
        const updated = await coreApi.glados.updateEntityStatus(
          this.localEntity.id,
          newStatus
        )
        this.localEntity = { ...updated }
      } catch (e) {
        // Optionally show error
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    onSliderInput() {
      // Just update the UI, no API call
      this.localEntity.value = this.sliderValue
    },
    async onSliderChange() {
      this.isLoading = true
      try {
        const updated = await coreApi.glados.updateEntityValue(
          this.localEntity.id,
          this.sliderValue
        )
        this.localEntity = { ...updated }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    async changeValue(delta) {
      let newValue = Number(this.localEntity.value) + delta
      newValue = Math.max(10, Math.min(35, newValue))
      this.isLoading = true
      try {
        const updated = await coreApi.glados.updateEntityValue(
          this.localEntity.id,
          newValue
        )
        this.localEntity = { ...updated }
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },
    onEdit() {
      this.$emit("edit", this.localEntity.id)
    },
  },
}
</script>

<style scoped>
.card-entity {
  min-width: 220px;
  transition: box-shadow 0.2s, background 0.2s;
  position: relative;
}
.icon svg {
  width: 2em;
  height: 2em;
  color: #6366f1; /* indigo-500 */
}
label.inline-flex {
  position: relative;
}
input[type="checkbox"].peer:checked + div {
  background: #4ade80; /* green-400 */
}
input[type="checkbox"].peer + div {
  transition: background 0.2s;
}
input[type="checkbox"].peer:checked ~ .absolute {
  transform: translateX(20px);
}
</style>
