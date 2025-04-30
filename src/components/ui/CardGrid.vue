<template>
  <div class="card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
    <CardEntity
      v-for="entity in entities"
      :key="entity.id"
      :entity="entity"
      @edit="$emit('edit', $event)"/>
  </div>
</template>

<script>
import CardEntity from "./CardEntity.vue"

export default {
  name: "CardGrid",
  components: { CardEntity },
  props: {
    entities: {
      type: Array,
      required: true,
    },
  },
}
</script>
