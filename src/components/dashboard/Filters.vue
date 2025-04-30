<template>
  <div class="flex flex-col gap-2">
    <!-- Room filter -->
    <div
      v-if="rooms.length"
      class="flex flex-row gap-2 overflow-x-auto pb-2">
      <button
        v-for="room in rooms"
        :key="room.id"
        @click="$emit('set-filter', { key: 'room', value: room.id })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.room === room.id
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        {{ room.name }}
      </button>
      <button
        @click="$emit('set-filter', { key: 'room', value: 'all' })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.room === 'all'
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        All Rooms
      </button>
    </div>
    <!-- Type filter -->
    <div
      v-if="types.length"
      class="flex flex-row gap-2 overflow-x-auto pb-2">
      <button
        v-for="type in types"
        :key="type"
        @click="$emit('set-filter', { key: 'type', value: type })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.type === type
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        {{ type }}
      </button>
      <button
        @click="$emit('set-filter', { key: 'type', value: 'all' })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.type === 'all'
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        All Types
      </button>
    </div>
    <!-- Status filter -->
    <div class="flex flex-row gap-2 overflow-x-auto pb-2">
      <button
        v-for="status in statuses"
        :key="status"
        @click="$emit('set-filter', { key: 'status', value: status })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.status === status
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        {{ status }}
      </button>
      <button
        @click="$emit('set-filter', { key: 'status', value: 'all' })"
        :class="[
          'px-4 py-1 rounded-full border',
          filter.status === 'all'
            ? 'bg-indigo-500 text-white border-indigo-500'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-indigo-50',
        ]">
        All Statuses
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Filters",
  props: {
    rooms: {
      type: Array,
      required: true,
      default: () => [],
    },
    types: {
      type: Array,
      required: true,
      default: () => [],
    },
    statuses: {
      type: Array,
      required: true,
      default: () => [],
    },
    filter: {
      type: Object,
      required: true,
    },
  },
}
</script>
