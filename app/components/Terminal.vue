<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';

/**
 * Terminal.vue
 * 
 * A reusable terminal window container that provides consistent
 * styling across all system phases.
 * 
 * Props:
 *  - title: Terminal window title
 *  - showChrome: Show/hide title bar with buttons
 *  - maxHeight: Maximum height before scrolling
 *  - maxWidth: Maximum width
 *  - autoScroll: Automatically scroll to bottom when content changes
 */

// =========================
// PROPS
// =========================
const props = defineProps({
  title: {
    type: String,
    default: 'system.log'
  },
  
  showChrome: {
    type: Boolean,
    default: true
  },
  
  maxHeight: {
    type: String,
    default: '400px'
  },
  
  maxWidth: {
    type: String,
    default: '600px'
  },
  
  autoScroll: {
    type: Boolean,
    default: true
  },
  
  // Styling variants
  variant: {
    type: String as () => 'default' | 'error' | 'success' | 'warning',
    default: 'default'
  }
});

// =========================
// STATE
// =========================
const contentRef = ref<HTMLElement | null>(null);

// =========================
// AUTO-SCROLL LOGIC
// =========================

/**
 * Scrolls content to bottom
 */
const scrollToBottom = () => {
  if (!props.autoScroll || !contentRef.value) return;
  
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.scrollTop = contentRef.value.scrollHeight;
    }
  });
};

/**
 * Watch for slot content changes and scroll
 * We use a MutationObserver to detect when slot content changes
 */
let observer: MutationObserver | null = null;

const setupObserver = () => {
  if (!contentRef.value || !props.autoScroll) return;
  
  observer = new MutationObserver(() => {
    scrollToBottom();
  });
  
  observer.observe(contentRef.value, {
    childList: true,
    subtree: true,
    characterData: true
  });
};

const cleanupObserver = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
};

// Setup observer when component mounts
watch(contentRef, (newVal) => {
  cleanupObserver();
  if (newVal) {
    setupObserver();
  }
});

// Cleanup on unmount
onBeforeUnmount(() => {
  cleanupObserver();
});

// =========================
// COMPUTED
// =========================

const variantClasses = computed(() => {
  return {
    'variant-error': props.variant === 'error',
    'variant-success': props.variant === 'success',
    'variant-warning': props.variant === 'warning'
  };
});
</script>

<template>
  <div 
    class="terminal-container"
    :class="variantClasses"
    :style="{ maxWidth: maxWidth }"
  >
    <!-- Terminal Chrome (title bar) -->
    <div v-if="showChrome" class="terminal-chrome">
      <div class="terminal-buttons">
        <span class="terminal-button close"></span>
        <span class="terminal-button minimize"></span>
        <span class="terminal-button maximize"></span>
      </div>
      <div class="terminal-title">{{ title }}</div>
    </div>

    <!-- Terminal Content (scrollable) -->
    <div 
      ref="contentRef"
      class="terminal-content"
      :style="{ maxHeight: maxHeight }"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* =========================
   TERMINAL CONTAINER
   ========================= */

.terminal-container {
  width: 100%;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

/* =========================
   VARIANTS
   ========================= */

.variant-error {
  border-color: rgba(239, 68, 68, 0.4); /* red */
}

.variant-success {
  border-color: rgba(34, 197, 94, 0.4); /* green */
}

.variant-warning {
  border-color: rgba(251, 146, 60, 0.4); /* orange */
}

/* =========================
   TERMINAL CHROME (Title Bar)
   ========================= */

.terminal-chrome {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(30, 30, 30, 0.95);
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  gap: 1rem;
}

.terminal-buttons {
  display: flex;
  gap: 0.5rem;
}

.terminal-button {
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  display: block;
}

.terminal-button.close {
  background: #ff5f56;
}

.terminal-button.minimize {
  background: #ffbd2e;
}

.terminal-button.maximize {
  background: #27c93f;
}

.terminal-title {
  font-family: monospace;
  font-size: 0.75rem;
  color: rgba(148, 163, 184, 0.8);
  flex: 1;
  text-align: center;
}

/* Variant title colors */
.variant-error .terminal-title {
  color: rgba(239, 68, 68, 0.8);
}

.variant-success .terminal-title {
  color: rgba(34, 197, 94, 0.8);
}

.variant-warning .terminal-title {
  color: rgba(251, 146, 60, 0.8);
}

/* =========================
   TERMINAL CONTENT (Scrollable Area)
   ========================= */

.terminal-content {
  padding: 1rem;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(0, 0, 0, 0.5);
  color: #e2e8f0; /* slate-200 */
  font-family: monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  
  /* Smooth scrolling */
  scroll-behavior: smooth;
}

/* Custom scrollbar styling */
.terminal-content::-webkit-scrollbar {
  width: 8px;
}

.terminal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.3);
}

.terminal-content::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.4);
  border-radius: 4px;
}

.terminal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.6);
}

/* Firefox scrollbar */
.terminal-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.4) rgba(0, 0, 0, 0.3);
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 640px) {
  .terminal-container {
    border-radius: 0.375rem;
  }
  
  .terminal-chrome {
    padding: 0.5rem 0.75rem;
  }
  
  .terminal-button {
    width: 0.625rem;
    height: 0.625rem;
  }
  
  .terminal-content {
    padding: 0.75rem;
    font-size: 0.7rem;
  }
}
</style>