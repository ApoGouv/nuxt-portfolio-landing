<script setup lang="ts">
import { ref } from 'vue';

/**
 * LightSwitch.vue
 * 
 * A toggle switch that controls lighting state.
 * Can be used as emergency power or manual light control.
 * 
 * Props:
 *  - lightsOn: boolean - Current light state (for v-model)
 *  - mode: 'emergency' | 'toggle' - Visual style
 *  - position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
 * 
 * Emits:
 *  - update:lightsOn: (value: boolean) - For v-model support
 *  - toggle: (newState: boolean) - When switch is toggled
 */

// =========================
// PROPS
// =========================
const props = defineProps({
  lightsOn: {
    type: Boolean,
    default: false
  },
  mode: {
    type: String as () => 'emergency' | 'toggle',
    default: 'toggle'
  },
  position: {
    type: String as () => 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left',
    default: 'bottom-right'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

// =========================
// EMITS
// =========================
const emit = defineEmits<{
  (e: 'update:lightsOn' | 'toggle', newState: boolean): void;
}>();

// =========================
// STATE
// =========================
const isAnimating = ref(false);

// =========================
// METHODS
// =========================
const handleClick = () => {
  if (props.disabled || isAnimating.value) return;
  
  isAnimating.value = true;
  const newState = !props.lightsOn;
  
  // Visual feedback delay
  setTimeout(() => {
    emit('update:lightsOn', newState);
    emit('toggle', newState);
    isAnimating.value = false;
  }, 200);
};

// =========================
// COMPUTED STYLES
// =========================
const positionClasses = {
  'bottom-right': 'bottom-20 right-6',
  'bottom-left': 'bottom-20 left-6',
  'top-right': 'top-20 right-6',
  'top-left': 'top-20 left-6'
};
</script>

<template>
  <div 
    class="light-switch-container fixed z-35"
    :class="positionClasses[position]"
  >
    <button
      class="light-switch"
      :class="[
        `mode-${mode}`,
        lightsOn ? 'lights-on' : 'lights-off',
        isAnimating && 'animating',
        disabled && 'disabled'
      ]"
      :disabled="disabled"
      :aria-label="mode === 'emergency' ? 'Emergency power switch' : 'Toggle lights'"
      :aria-pressed="lightsOn"
      @click="handleClick"
    >
      <!-- Switch Icon -->
      <div class="switch-icon-wrapper">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="switch-icon"
        >
          <circle 
            cx="12" 
            cy="12" 
            r="10" 
            :stroke="lightsOn ? 'currentColor' : 'currentColor'" 
            stroke-width="2"
            class="circle"
          />
          <path
            d="M12 6 L12 12"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            class="power-line"
            :class="lightsOn && 'active'"
          />
        </svg>
        
        <!-- Light indicator -->
        <div class="light-indicator" :class="lightsOn && 'active'" />
      </div>

      <!-- Hint text -->
      <span class="hint-text">
        <template v-if="mode === 'emergency'">
          {{ lightsOn ? 'POWER ON' : 'EMERGENCY POWER' }}
        </template>
        <template v-else>
          {{ lightsOn ? 'LIGHTS ON' : 'LIGHTS OFF' }}
        </template>
      </span>
    </button>
  </div>
</template>

<style scoped>
/* =========================
   SWITCH BUTTON BASE
   ========================= */

.light-switch {
  position: relative;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.7);
  border: 2px solid rgba(148, 163, 184, 0.4); /* slate-400 */
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light-switch:hover {
  transform: scale(1.1);
}

.light-switch:active:not(.disabled) {
  transform: scale(0.95);
}

.light-switch.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* =========================
   EMERGENCY MODE STYLING
   ========================= */

.mode-emergency.lights-off {
  border-color: rgba(251, 146, 60, 0.4); /* orange */
  color: rgb(251, 146, 60);
  animation: pulse-glow 3s ease-in-out infinite;
}

.mode-emergency.lights-off:hover {
  background: rgba(251, 146, 60, 0.1);
  border-color: rgb(251, 146, 60);
}

.mode-emergency.lights-on {
  background: rgba(34, 197, 94, 0.15); /* green */
  border-color: rgb(34, 197, 94);
  color: rgb(34, 197, 94);
  animation: none;
}

/* =========================
   TOGGLE MODE STYLING
   ========================= */

.mode-toggle.lights-off {
  border-color: rgba(148, 163, 184, 0.5); /* slate */
  color: rgb(148, 163, 184);
}

.mode-toggle.lights-off:hover {
  background: rgba(148, 163, 184, 0.1);
  border-color: rgb(148, 163, 184);
}

.mode-toggle.lights-on {
  background: rgba(250, 204, 21, 0.15); /* yellow - representing light */
  border-color: rgb(250, 204, 21);
  color: rgb(250, 204, 21);
  box-shadow: 0 0 20px rgba(250, 204, 21, 0.3);
}

/* =========================
   ICON STYLING
   ========================= */

.switch-icon-wrapper {
  position: relative;
  width: 1.75rem;
  height: 1.75rem;
}

.switch-icon {
  width: 100%;
  height: 100%;
  transition: transform 0.3s ease;
}

.light-switch:hover .switch-icon {
  transform: rotate(15deg);
}

.light-switch.lights-on .switch-icon {
  transform: rotate(180deg);
}

.power-line {
  transition: stroke-width 0.3s ease;
}

.power-line.active {
  stroke-width: 3;
  filter: drop-shadow(0 0 2px currentColor);
}

/* Light indicator dot */
.light-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: currentColor;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.light-indicator.active {
  opacity: 1;
  animation: indicator-pulse 2s ease-in-out infinite;
}

/* =========================
   HINT TEXT
   ========================= */

.hint-text {
  position: absolute;
  bottom: calc(100% + 0.75rem);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.95);
  color: currentColor;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.625rem;
  font-family: monospace;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease, transform 0.2s ease;
  border: 1px solid currentColor;
}

.light-switch:hover .hint-text {
  opacity: 1;
  transform: translateX(-50%) translateY(-0.25rem);
}

/* =========================
   ANIMATIONS
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

@keyframes indicator-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animating {
  animation: switch-flip 0.3s ease;
}

@keyframes switch-flip {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.15) rotate(10deg); }
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 640px) {
  .light-switch {
    width: 3rem;
    height: 3rem;
  }
  
  .switch-icon-wrapper {
    width: 1.5rem;
    height: 1.5rem;
  }
  
  .light-switch-container {
    bottom: 4.5rem !important;
    right: 1rem !important;
  }
}
</style>