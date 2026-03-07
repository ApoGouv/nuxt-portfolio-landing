<script setup lang="ts">
import { ref } from 'vue';

/**
 * PowerSwitch.vue
 * 
 * A hidden power switch in the lower-right corner that pulses subtly
 * to hint at its location. When clicked, it triggers system recovery.
 * 
 * Emits:
 *  - activated: when the switch is clicked
 */

const emit = defineEmits<{
  (e: 'activated'): void;
}>();

const isActivated = ref(false);

const handleClick = () => {
  if (isActivated.value) return;
  
  isActivated.value = true;
  
  // Visual feedback before emitting
  setTimeout(() => {
    emit('activated');
  }, 300);
};
</script>

<template>
  <div class="power-switch-container">
    <button
      class="power-switch"
      :class="{ 'activated': isActivated }"
      :disabled="isActivated"
      aria-label="Emergency power switch"
      @click="handleClick"
    >
      <!-- Switch icon using a simple SVG -->
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="switch-icon"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <path
          d="M12 6 L12 12"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      
      <!-- Hint text (appears on hover) -->
      <span class="hint-text">
        {{ isActivated ? 'ACTIVATED' : 'EMERGENCY POWER' }}
      </span>
    </button>
  </div>
</template>

<style scoped>
/* =========================
   CONTAINER POSITIONING
   ========================= */

.power-switch-container {
  position: fixed;
  bottom: 5rem; /* Above footer */
  right: 2rem;
  z-index: 100;
}

/* =========================
   SWITCH BUTTON
   ========================= */

.power-switch {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid rgba(251, 146, 60, 0.4); /* orange-400 with opacity */
  color: rgb(251, 146, 60); /* orange-400 */
  cursor: pointer;
  transition: all 0.3s ease;
  
  /* Subtle pulsing animation to hint at location */
  animation: pulse-glow 3s ease-in-out infinite;
}

.power-switch:hover {
  background: rgba(251, 146, 60, 0.1);
  border-color: rgb(251, 146, 60);
  transform: scale(1.1);
}

.power-switch:active {
  transform: scale(0.95);
}

.power-switch.activated {
  background: rgba(34, 197, 94, 0.2); /* green */
  border-color: rgb(34, 197, 94);
  color: rgb(34, 197, 94);
  animation: none;
  cursor: not-allowed;
}

/* =========================
   SWITCH ICON
   ========================= */

.switch-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: transform 0.3s ease;
}

.power-switch:hover .switch-icon {
  transform: rotate(15deg);
}

.power-switch.activated .switch-icon {
  transform: rotate(180deg);
}

/* =========================
   HINT TEXT (on hover)
   ========================= */

.hint-text {
  position: absolute;
  bottom: calc(100% + 0.5rem);
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: rgb(251, 146, 60);
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-family: monospace;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transform: translateY(0.25rem);
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.power-switch:hover .hint-text {
  opacity: 1;
  transform: translateY(0);
}

.power-switch.activated .hint-text {
  color: rgb(34, 197, 94);
}

/* =========================
   PULSING GLOW ANIMATION
   ========================= */

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 5px rgba(251, 146, 60, 0.3);
    border-color: rgba(251, 146, 60, 0.4);
  }
  50% {
    box-shadow: 0 0 20px rgba(251, 146, 60, 0.6);
    border-color: rgba(251, 146, 60, 0.8);
  }
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 640px) {
  .power-switch-container {
    bottom: 4rem;
    right: 1rem;
  }
  
  .power-switch {
    width: 3rem;
    height: 3rem;
  }
  
  .switch-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>