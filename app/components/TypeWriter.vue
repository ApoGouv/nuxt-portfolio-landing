<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

// =========================
// EMITS
// =========================
const emit = defineEmits<{
  (e: "line-start" | "line-end", index: number, line: string): void;
  (e: "finished"): void;
}>();

// =========================
// PROPS
// =========================
const props = defineProps({
  wrapperClass: {
    type: String,
    default: "font-mono text-xs leading-relaxed"
  },

  lines: {
    type: Array as () => string[],
    default: () => [],
  },

  // typing behavior
  typeSpeed: { type: Number, default: 38 },         
  naturalTyping: { type: Boolean, default: true },   
  punctuationPause: { type: Number, default: 260 },  

  // line behavior
  lineDelay: { type: Number, default: 350 },
  pauseBetweenLines: { type: Number, default: 0 },

  // cursor
  cursorChar: { type: String, default: "▍" },
  cursorBlinkSpeed: { type: Number, default: 450 },
});

// =========================
// INTERNAL STATE
// =========================
const outputLines = ref<string[]>([]);
const currentLine = ref("");
const cursorVisible = ref(true);

let lineIndex = 0;
let charIndex = 0;
let cursorInterval: number | undefined;

// =========================
// TYPING ENGINE
// =========================

function getDelay(char: string) {
  let base = props.typeSpeed;

  if (!props.naturalTyping) return base;

  // jitter
  base += Math.random() * 120;

  // punctuation = extra pause
  if (/[.,?!:;]/.test(char)) {
    base += props.punctuationPause;
  }

  return base;
}

function typeNextChar() {
  const line = props.lines[lineIndex];
  if (!line) return;

  // New line start
  if (charIndex === 0) {
    emit("line-start", lineIndex, line);
  }

  const char = line[charIndex];

  if (charIndex < line.length) {
    currentLine.value += char;
    charIndex++;

    setTimeout(typeNextChar, getDelay(char));
  } else {
    // Line end
    outputLines.value.push(currentLine.value);

    emit("line-end", lineIndex, currentLine.value);

    currentLine.value = "";
    charIndex = 0;
    lineIndex++;

    // Finished all lines
    if (lineIndex >= props.lines.length) {
      emit("finished");
      return;
    }

    setTimeout(typeNextChar, props.lineDelay + props.pauseBetweenLines);
  }
}

// =========================
// LIFECYCLE
// =========================
onMounted(() => {
  // blink cursor only on client
  cursorInterval = window.setInterval(() => {
    cursorVisible.value = !cursorVisible.value;
  }, props.cursorBlinkSpeed);

  typeNextChar();
});

onBeforeUnmount(() => {
  if (cursorInterval) clearInterval(cursorInterval);
});
</script>

<template>
  <div :class="wrapperClass">
    <!-- Finished lines -->
    <div 
      v-for="(line, outputLineIndex) in outputLines" 
      :key="outputLineIndex"
      class="terminal-line"
    >
      {{ line }}
    </div>

    <!-- Active line -->
    <div class="terminal-line inline-block">
      {{ currentLine }}
      <span v-if="cursorVisible" class="cursor">
        {{ props.cursorChar }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.terminal-line {
  margin-bottom: 0.25rem;
  word-wrap: break-word;
  white-space: pre-wrap;
}

.cursor {
  opacity: 0.7;
  transition: opacity 0.15s ease;
  color: #22c55e; /* green-500 for terminal aesthetic */
}
</style>