<template>
  <div class="flex flex-col gap-2">
    <!-- Room filter -->
    <div class="flex flex-row gap-2 items-center pb-2">
      <div class="flex flex-row gap-2 overflow-x-auto">
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
      <button
        @click="$emit('manage-rooms')"
        class="text-gray-500 hover:text-indigo-500 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
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
