<script setup lang="ts">

// Emit the same events as the TypeWriter
const emit = defineEmits<{
  (e: "line-start" | "line-end", index: number, line: string): void;
  (e: "finished"): void;
}>();

// =========================
// PROPS
// =========================
const props = defineProps({
  lines: {
    type: Array as () => string[],
    default: () => [
      "> Loading subsystems…",
      "> Calibrating visual cores…",
      "> Spinning up design engine…",
      "> Fetching creative assets…",
      "> Initializing UI modules…",
      "> System boot complete.",
    ]
  },

  // Allow style overrides
  wrapperClass: {
    type: String,
    default: "boot-sequence",
  },

  // TypeWriter wrapper class
  trWrapperClass: {
    type: String,
    default: "font-mono text-xs leading-relaxed"
  },

  // Typing behavior overrides
  typeSpeed: { type: Number, default: 34 },
  naturalTyping: { type: Boolean, default: true },
  punctuationPause: { type: Number, default: 240 },

  lineDelay: { type: Number, default: 300 },
  pauseBetweenLines: { type: Number, default: 0 },

  cursorChar: { type: String, default: "▍" },
  cursorBlinkSpeed: { type: Number, default: 450 },
});
</script>

<template>
  <div :class="wrapperClass">
    <!-- Typewriter Block -->
    <TypeWriter
      :lines="props.lines"
      :wrapper-class="props.trWrapperClass"
      :type-speed="props.typeSpeed"
      :natural-typing="props.naturalTyping"
      :punctuation-pause="props.punctuationPause"
      :line-delay="props.lineDelay"
      :pause-between-lines="props.pauseBetweenLines"
      :cursor-char="props.cursorChar"
      :cursor-blink-speed="props.cursorBlinkSpeed"

      @line-start="(...args) => emit('line-start', ...args)"
      @line-end="(...args) => emit('line-end', ...args)"
      @finished="emit('finished')"
    />
  </div>
</template>