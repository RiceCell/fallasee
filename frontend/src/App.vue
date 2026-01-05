<script setup>
import { ref } from 'vue'

const userInput = ref('')
const result = ref(null) 
const isLoading = ref(false)

async function analyzeFallacy() {
  if (!userInput.value) return alert("bogo type smthng first!")
  
  isLoading.value = true
  result.value = null

  try {
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: userInput.value })
    })

    const data = await response.json()
    result.value = data 
    } catch (error) {
    result.value = {
        name: "Professor is Tired",
        explanation: "I've analyzed too many fallacies today! My brain (Gemini API Quota lmfao) needs a short nap.",
        rating: "0/5",
        advice: "Try again tomorrow broskie <3",
        reframe: "Patience is a virtue—try again shortly!"
    };
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
        class="w-full py-4 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] rounded-xl font-bold text-xl shadow-lg transition-all disabled:opacity-50"
      >
        <span v-if="!isLoading">Detect Fallacy</span>
        <span v-else>Analyzing...</span>
      </button>

      <transition name="fade">
        <div v-if="result" class="space-y-4">
          
          <div class="bg-slate-800 p-8 rounded-xl shadow-2xl text-center border-b-4 border-blue-500">
            <h2 class="text-3xl font-black text-blue-400 uppercase mb-4">{{ result.name }}</h2>
            <p class="text-slate-300 leading-relaxed">{{ result.explanation }}</p>
            <div class="mt-4 inline-block px-4 py-1 bg-blue-900/30 rounded-full text-blue-400 text-sm font-bold">
              {{ result.rating }}
            </div>
          </div>

          <div class="bg-amber-900/20 border border-amber-500/30 p-6 rounded-xl">
            <h3 class="text-amber-500 font-bold uppercase text-xs tracking-widest mb-2">Professor's Advice</h3>
            <p class="text-slate-300 italic">"{{ result.advice }}"</p>
          </div>

          <div class="bg-emerald-900/20 border border-emerald-500/30 p-6 rounded-xl">
            <h3 class="text-emerald-500 font-bold uppercase text-xs tracking-widest mb-2">Logical Reframe</h3>
            <p class="text-emerald-50 text-lg font-medium">{{ result.reframe }}</p>
          </div>

        </div>
      </transition>
    </main>

    <footer class="mt-auto pt-10 text-slate-500 text-sm">
      Built by Russel • Powered by Gemini 2.5
    </footer>
  </div>
</template>