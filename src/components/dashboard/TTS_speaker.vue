<template>
  <div class="p-4 border border-gray-300 rounded-md max-w-sm mx-auto">
    <div class="relative inline-block w-full mb-2 flex gap-2">
      <button
        @click="onGenerateSummary"
        class="flex-1 px-4 py-2 text-white rounded-md flex justify-between items-center"
        :class="isLoading ? 'bg-gray-400' : 'bg-indigo-500 hover:bg-indigo-600'"
        :disabled="isLoading">
        <span>Generate Summary ({{ selectedLanguageLabel }})</span>
        <svg
          v-if="!isLoading"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
          @click.stop="toggleLanguageDropdown">
          <path
            fill-rule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clip-rule="evenodd"/>
        </svg>
        <svg
          v-if="isLoading"
          class="animate-spin h-5 w-5 ml-2 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24">
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
      </button>
      <button
        v-if="summary || audioUrl"
        @click="resetAll"
        class="px-4 py-2 text-white rounded-md flex items-center bg-red-500 hover:bg-red-600 focus:outline-none"
        title="Reset">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 8.586l3.536-3.535a1 1 0 111.415 1.415L11.414 10l3.537 3.535a1 1 0 01-1.415 1.415L10 11.414l-3.535 3.536a1 1 0 01-1.415-1.415L8.586 10 5.05 6.464a1 1 0 011.415-1.415L10 8.586z"
            clip-rule="evenodd"/>
        </svg>
      </button>
      <div
        v-if="showLanguageDropdown"
        class="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg left-0 top-full">
        <ul>
          <li
            v-for="lang in languages"
            :key="lang.value"
            @click="selectLanguage(lang)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer">
            {{ lang.label }}
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="isLoading"
      class="mt-4 text-center">

    </div>
    <div
      v-else-if="summary"
      class="mt-4 text-center flex flex-col items-center">
      <div class="flex items-center gap-2">
        <span>
          {{ isSummaryExpanded ? summary : summaryPreview }}
        </span>
        <button
          v-if="summary.length > previewLength"
          @click="isSummaryExpanded = !isSummaryExpanded"
          class="ml-1 text-indigo-500 focus:outline-none">
          <svg
            v-if="!isSummaryExpanded"
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
              clip-rule="evenodd"/>
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06l-3.71 3.71a.75.75 0 11-1.06-1.06l4.24-4.24a.75.75 0 011.06 0l4.24 4.24a.75.75 0 01-.02 1.08z"
              clip-rule="evenodd"/>
          </svg>
        </button>
        <button
          v-if="!audioUrl"
          @click="speakSummary"
          class="ml-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
          title="Speak">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path d="M9 7a1 1 0 00-1 1v4a1 1 0 001 1h2a1 1 0 001-1V8a1 1 0 00-1-1H9z"/>
            <path
              fill-rule="evenodd"
              d="M5.293 9.293a1 1 0 011.414 0L10 12.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"/>
          </svg>
        </button>
      </div>
      <audio
        v-if="audioUrl"
        :src="audioUrl"
        controls
        autoplay
        @ended="isSpeaking = false"></audio>
    </div>
  </div>
</template>

<script>
import coreApi from "@/providers/core-api"

export default {
  name: "TTS_Speaker",
  props: {
    filter: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedLanguage: "en-US",
      selectedVoice: null, // Optionally add voice selection
      showLanguageDropdown: false,
      isSpeaking: false,
      isLoading: false,
      summary: "",
      audioUrl: "",
      isSummaryExpanded: false,
      previewLength: 30,
      languages: [
        {
          value: "en-US",
          label: "English",
        },
        {
          value: "fr-FR",
          label: "French",
        },
        {
          value: "es-ES",
          label: "Spanish",
        },
      ],
    }
  },
  computed: {
    selectedLanguageLabel() {
      const lang = this.languages.find(
        (l) => l.value === this.selectedLanguage
      )
      return lang ? lang.label : "Unknown"
    },
    summaryPreview() {
      if (!this.summary) return ""
      return this.summary.length > this.previewLength
        ? this.summary.slice(0, this.previewLength) + "..."
        : this.summary
    },
  },
  methods: {
    toggleLanguageDropdown() {
      this.showLanguageDropdown = !this.showLanguageDropdown
    },
    selectLanguage(lang) {
      this.selectedLanguage = lang.value
      this.showLanguageDropdown = false
    },
    async onGenerateSummary() {
      this.isLoading = true
      this.summary = ""
      this.audioUrl = ""
      this.isSummaryExpanded = false
      try {
        const params = {
          language: this.selectedLanguage,
          ...this.filter,
        }
        const response = await coreApi.glados.getEntitiesTTS(params)
        const { summary, audio_base64 } = response
        this.summary = summary
        if (audio_base64) {
          this.audioUrl = `data:audio/mp3;base64,${audio_base64}`
        } else {
          this.audioUrl = ""
        }
      } catch (error) {
        // Fallback: fetch entities and generate a simple summary
        try {
          const entities = await coreApi.glados.getEntities(this.filter)
          if (entities && entities.length) {
            this.summary = entities
              .map(
                (e) =>
                  `${e.name}${
                    e.value !== null && e.value !== undefined
                      ? `: ${e.value}`
                      : ""
                  }`
              )
              .join(", ")
          } else {
            this.summary = "No entities found."
          }
        } catch (fallbackError) {
          this.summary = "Error generating summary."
        }
        this.audioUrl = ""
      } finally {
        this.isLoading = false
      }
    },
    speakSummary() {
      if (!this.summary) return
      const utterance = new window.SpeechSynthesisUtterance(this.summary)
      utterance.lang = this.selectedLanguage
      window.speechSynthesis.speak(utterance)
    },
    resetAll() {
      this.summary = ""
      this.audioUrl = ""
      this.isSummaryExpanded = false
      this.isSpeaking = false
    },
  },
  watch: {
    filter: {
      handler() {
        this.summary = ""
        this.audioUrl = ""
        this.isSummaryExpanded = false
      },
      deep: true,
    },
  },
}
</script>
