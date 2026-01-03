<script setup>
import { ref, computed } from 'vue'
import { marked } from 'marked' 

const userInput = ref('')
const result = ref('')
const isLoading = ref(false)

const formattedResult = computed(() => {
  return marked.parse(result.value)
})

async function analyzeFallacy() {
  if (!userInput.value) return alert("Type something first, Boang!")
  
  isLoading.value = true
  result.value = ''

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {//backend is running on port 3000
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput.value })
    })

    const data = await response.json()
    result.value = data.analysis 
  } catch (error) {
    result.value = "## Error\nCould not connect to the Professor. Is the backend running?"
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-900 text-white p-8 flex flex-col items-center font-sans">
    
    <header class="mb-10 text-center">
      <h1 class="text-5xl font-bold text-blue-500 tracking-tight">Fallasee</h1>
      <p class="text-slate-400 mt-2 italic">Logic professor in a pocket.</p>
    </header>

    <main class="w-full max-w-2xl space-y-6">
      
      <div class="bg-slate-800 p-1 rounded-xl shadow-2xl border border-slate-700">
        <textarea 
          v-model="userInput"
          placeholder="Paste your argument here..."
          class="w-full bg-slate-900 p-4 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 h-44 resize-none text-lg transition-all"
        ></textarea>
      </div>

      <button 
        @click="analyzeFallacy"
        :disabled="isLoading"
        class="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl font-bold text-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="!isLoading" class="text-white">Detect Fallacy</span>
        <span v-else class="flex items-center justify-center gap-2">
          <svg class="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Analyzing...
        </span>
      </button>

      <transition name="fade">
        <div v-if="result" class="bg-slate-800 border-l-8 border-blue-500 p-8 rounded-r-xl shadow-2xl">
          <h2 class="text-blue-400 font-black mb-6 uppercase tracking-widest text-sm border-b border-slate-700 pb-2">
            Professor's Analysis
          </h2>
          
          <div 
            class="prose prose-invert prose-blue max-w-none text-slate-200"
            v-html="formattedResult"
          ></div>
        </div>
      </transition>
    </main>

    <footer class="mt-auto pt-10 text-slate-500 text-sm">
      Built by Russel • Powered by Gemini 2.5
    </footer>
  </div>
</template>

<style>
/* Smooth fade-in for the result card */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar for the textarea */
textarea::-webkit-scrollbar {
  width: 8px;
}
textarea::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
}
</style>