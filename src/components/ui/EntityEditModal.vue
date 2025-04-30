<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Edit Entity</h2>
      <form @submit.prevent="onSave">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded px-3 py-2"
            required/>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Type</label>
          <select
            v-model="form.type"
            class="w-full border rounded px-3 py-2"
            required>
            <option
              v-for="type in types"
              :key="type"
              :value="type">
              {{ type }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Room</label>
          <select
            v-model="form.room_id"
            class="w-full border rounded px-3 py-2"
            required>
            <option
              v-for="room in rooms"
              :key="room.id"
              :value="room.id">
              {{ room.name }}
            </option>
          </select>
        </div>
        <div class="flex justify-end gap-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "EntityEditModal",
  props: {
    entity: {
      type: Object,
      required: true,
    },
    rooms: {
      type: Array,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: this.entity.name || "",
        type: this.entity.type || this.types[0] || "",
        room_id: this.entity.room_id || this.rooms[0]?.id || "",
      },
    }
  },
  watch: {
    entity: {
      handler(newVal) {
        this.form = {
          name: newVal.name || "",
          type: newVal.type || this.types[0] || "",
          room_id: newVal.room_id || this.rooms[0]?.id || "",
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    onSave() {
      this.$emit("save", { ...this.form })
    },
  },
}
</script>
