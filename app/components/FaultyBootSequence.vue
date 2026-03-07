<script setup lang="ts">
/**
 * FaultyBootSequence.vue
 * 
 * A wrapper around TypeWriter that simulates a boot sequence that fails
 * at the lighting module initialization step.
 */

// =========================
// EMITS
// =========================
const emit = defineEmits<{
  (e: "line-start" | "line-end" | "boot-failed", index: number, line: string): void;
}>();

// =========================
// PROPS
// =========================
const props = defineProps({
  // The line number (0-indexed) where boot should fail
  failureLineIndex: {
    type: Number,
    default: 4 // Fails at line 5 (lighting module)
  },

  lines: {
    type: Array as () => string[],
    default: () => [
      "> Initializing core subsystems…",
      "> Loading memory banks… OK",
      "> Calibrating visual processors… OK",
      "> Spinning up design engine… OK",
      "> Activating lighting module…",  // <- Fails here (index 4)
      "> ERROR: Lighting module unresponsive",
      "> CRITICAL: Cannot proceed with standard boot",
    ]
  },

  wrapperClass: {
    type: String,
    default: "faulty-boot-sequence"
  },

  trWrapperClass: {
    type: String,
    default: "font-mono text-xs leading-relaxed"
  },

  // TypeWriter behavior overrides
  typeSpeed: { type: Number, default: 36 },
  naturalTyping: { type: Boolean, default: true },
  punctuationPause: { type: Number, default: 260 },
  lineDelay: { type: Number, default: 320 },
  pauseBetweenLines: { type: Number, default: 0 },
  cursorChar: { type: String, default: "▍" },
  cursorBlinkSpeed: { type: Number, default: 450 }
});

// =========================
// EVENT HANDLERS
// =========================

/**
 * Intercept line-end events to detect failure
 */
const handleLineEnd = (lineIndex: number, line: string) => {
  // Forward the event
  emit("line-end", lineIndex, line);

  // Check if this is the failure line
  if (lineIndex === props.failureLineIndex) {
    console.log(`[FaultyBoot] Failure detected at line ${lineIndex}`);
    
    // Emit boot-failed after a brief pause to let user read the error
    setTimeout(() => {
      emit("boot-failed", lineIndex, line);
    }, 800);
  }
};

/**
 * Forward line-start events
 */
const handleLineStart = (lineIndex: number, line: string) => {
  emit("line-start", lineIndex, line);
};
</script>

<template>
  <div :class="wrapperClass">
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
      
      @line-start="handleLineStart"
      @line-end="handleLineEnd"
    />
  </div>
</template>