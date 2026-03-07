<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';

/**
 * SpotlightEffect.vue
 * 
 * A reusable spotlight effect component that follows the cursor
 * and darkens the page except for a circular spotlight area.
 * 
 * Props:
 *  - active: boolean - Whether the spotlight is active
 *  - intensity: 'normal' | 'dark' | 'darker' - Darkness level
 *  - radius: number - Spotlight radius in pixels
 */

// =========================
// PROPS
// =========================
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  intensity: {
    type: String as () => 'normal' | 'dark' | 'darker',
    default: 'dark',
    validator: (value: string) => ['normal', 'dark', 'darker'].includes(value)
  },
  radius: {
    type: Number,
    default: 180
  }
});

// =========================
// STATE
// =========================
const overlayRef = ref<HTMLDivElement | null>(null);
const spotlightVisible = ref(false);

// =========================
// SPOTLIGHT LOGIC
// =========================

let rafId: number | null = null;
let latestX = -9999;
let latestY = -9999;

const applyPosition = (x: number, y: number) => {
  if (!overlayRef.value) return;
  
  overlayRef.value.style.setProperty('--sx', `${x}px`);
  overlayRef.value.style.setProperty('--sy', `${y}px`);
  overlayRef.value.style.setProperty('--r', `${props.radius}px`);
};

const computeLocalPosition = (clientX: number, clientY: number): [number, number] => {
  if (!overlayRef.value) return [-9999, -9999];
  
  const rect = overlayRef.value.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  return [localX, localY];
};

const scheduleUpdate = (clientX: number, clientY: number) => {
  const [lx, ly] = computeLocalPosition(clientX, clientY);
  latestX = Math.round(lx);
  latestY = Math.round(ly);

  if (!spotlightVisible.value) {
    spotlightVisible.value = true;
  }

  if (rafId === null) {
    rafId = requestAnimationFrame(() => {
      applyPosition(latestX, latestY);
      rafId = null;
    });
  }
};

// =========================
// EVENT HANDLERS
// =========================

const onMouseMove = (e: MouseEvent) => {
  if (!props.active) return;
  scheduleUpdate(e.clientX, e.clientY);
};

const onTouchMove = (e: TouchEvent) => {
  if (!props.active || !e.touches || e.touches.length === 0) return;
  const touch = e.touches[0];
  scheduleUpdate(touch.clientX, touch.clientY);
};

const onMouseLeave = () => {
  spotlightVisible.value = false;
  applyPosition(-9999, -9999);
};

const onTouchEnd = () => {
  spotlightVisible.value = false;
  applyPosition(-9999, -9999);
};

// =========================
// LIFECYCLE & WATCHERS
// =========================

onMounted(() => {
  // Initialize position offscreen
  applyPosition(-9999, -9999);

  // Attach event listeners to document for page-wide tracking
  document.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave);
  document.addEventListener('touchmove', onTouchMove, { passive: true });
  document.addEventListener('touchend', onTouchEnd);
  document.addEventListener('touchcancel', onTouchEnd);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', onMouseMove);
  document.removeEventListener('mouseleave', onMouseLeave);
  document.removeEventListener('touchmove', onTouchMove);
  document.removeEventListener('touchend', onTouchEnd);
  document.removeEventListener('touchcancel', onTouchEnd);
  
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
});

// Watch for active state changes
watch(() => props.active, (isActive) => {
  if (!isActive) {
    // Hide spotlight when deactivated
    spotlightVisible.value = false;
    applyPosition(-9999, -9999);
  }
});

// Watch for radius changes
watch(() => props.radius, (newRadius) => {
  if (overlayRef.value) {
    overlayRef.value.style.setProperty('--r', `${newRadius}px`);
  }
});
</script>

<template>
  <Transition name="spotlight-fade">
    <div
      v-if="active"
      ref="overlayRef"
      class="spotlight-overlay"
      :class="[
        `intensity-${intensity}`,
        spotlightVisible && 'visible'
      ]"
      aria-hidden="true"
    />
  </Transition>
</template>

<style scoped>
/* =========================
   SPOTLIGHT OVERLAY BASE
   ========================= */

.spotlight-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  
  /* CSS variables updated by JavaScript */
  --sx: -9999px;
  --sy: -9999px;
  --r: 140px;
  
  /* Base gradient - will be overridden by intensity classes */
  background-image: radial-gradient(
    circle var(--r) at var(--sx) var(--sy),
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.45) 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
  
  transition: background-image 120ms linear;
  will-change: background-image;
}

.spotlight-overlay.visible {
  transition-duration: 80ms;
}

/* =========================
   INTENSITY LEVELS
   ========================= */

/* Normal - subtle darkening (original) */
.intensity-normal {
  background-image: radial-gradient(
    circle var(--r) at var(--sx) var(--sy),
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.2) 30%,
    rgba(0, 0, 0, 0.45) 60%,
    rgba(0, 0, 0, 0.7) 100%
  );
}

/* Dark - emergency mode */
.intensity-dark {
  background-image: radial-gradient(
    circle var(--r) at var(--sx) var(--sy),
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.5) 20%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
}

/* Darker - maximum darkness */
.intensity-darker {
  background-image: radial-gradient(
    circle var(--r) at var(--sx) var(--sy),
    rgba(255, 255, 255, 0) 0%,
    rgba(0, 0, 0, 0.65) 15%,
    rgba(0, 0, 0, 0.85) 40%,
    rgba(0, 0, 0, 0.96) 100%
  );
}

/* =========================
   FADE TRANSITION
   ========================= */

.spotlight-fade-enter-active,
.spotlight-fade-leave-active {
  transition: opacity 500ms ease;
}

.spotlight-fade-enter-from,
.spotlight-fade-leave-to {
  opacity: 0;
}

/* =========================
   RESPONSIVE
   ========================= */

@media (max-width: 640px) {
  .spotlight-overlay {
    --r: 110px;
  }
}
</style>