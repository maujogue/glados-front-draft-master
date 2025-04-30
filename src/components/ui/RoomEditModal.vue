<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-xl font-bold mb-4">Manage Rooms</h2>
      <form @submit.prevent="onSave">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">Room Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full border rounded px-3 py-2"
            required/>
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
      <div class="mt-4">
        <h3 class="text-lg font-semibold">Existing Rooms</h3>
        <ul>
          <li
            v-for="room in rooms"
            :key="room.id"
            class="flex justify-between items-center py-2">
            <div class="flex items-center gap-2">
              <span v-if="editingRoomId !== room.id">{{ room.name }}</span>
              <div
                v-else
                class="flex items-center gap-2">
                <input
                  v-model="editForm.name"
                  type="text"
                  class="border rounded px-2 py-1"/>
                <button
                  @click="onUpdateRoom(room.id)"
                  class="text-green-500 hover:text-green-700">
                  <lucide-check class="w-5 h-5" />
                </button>
                <button
                  @click="cancelEdit"
                  class="text-red-500 hover:text-red-700">
                  <lucide-x class="w-5 h-5" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <button
                v-if="editingRoomId !== room.id"
                @click="startEdit(room)"
                class="text-blue-500 hover:text-blue-700">
                <lucide-edit-3 class="w-5 h-5" />
              </button>
              <button
                @click="onDelete(room.id)"
                class="text-red-500 hover:text-red-700">
                <lucide-trash-2 class="w-5 h-5" />
              </button>
            </div>
          </li>
        </ul>
        <p
          v-if="errorMessage"
          class="text-red-500 mt-2">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Check, Edit3, Trash2, X 
} from "lucide-vue-next"

export default {
  name: "RoomEditModal",
  components: {
    LucideCheck: Check,
    LucideX: X,
    LucideEdit3: Edit3,
    LucideTrash2: Trash2,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    rooms: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      form: { name: "", },
      editForm: { name: "", },
      editingRoomId: null,
      errorMessage: "",
    }
  },
  methods: {
    onSave() {
      this.$emit("save", { ...this.form })
      this.form.name = ""
    },
    onDelete(roomId) {
      this.$emit("delete", roomId)
    },
    startEdit(room) {
      this.editingRoomId = room.id
      this.editForm.name = room.name
    },
    cancelEdit() {
      this.editingRoomId = null
      this.editForm.name = ""
      this.errorMessage = ""
    },
    async onUpdateRoom(roomId) {
      try {
        await this.$emit("update", {
          id: roomId,
          name: this.editForm.name 
        })
        this.cancelEdit()
      } catch (error) {
        this.errorMessage = error.message || "Failed to update room."
      }
    },
  },
}
</script>