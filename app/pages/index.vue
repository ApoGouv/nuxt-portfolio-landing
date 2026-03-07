<script setup lang="ts">
import { ref, computed } from "vue";

// =========================
// SYSTEM PHASE MANAGEMENT
// =========================
type SystemPhase = 'initial-boot' | 'system-failure' | 'spotlight-active' | 'recovery-boot' | 'online';

const phase = ref<SystemPhase>('initial-boot');
const lightsOn = ref(true); // Track light state
const showLightSwitch = ref(false); // Show after first boot completes

// =========================
// COMPUTED PROPERTIES
// =========================

const spotlightActive = computed(() => {
  // Spotlight active when lights are off AND system is operational
  return !lightsOn.value && (phase.value === 'spotlight-active' || phase.value === 'online');
});

const spotlightIntensity = computed<'normal' | 'dark' | 'darker'>(() => {
  if (phase.value === 'spotlight-active') {
    return 'darker'; // Emergency mode - very dark
  }
  return 'dark'; // Normal manual toggle - moderately dark
});

const title = 'Cube Designs';

const description = computed(() => {
  switch (phase.value) {
    case 'initial-boot':
      return 'New environment loading. Visual modules compiling. Stand by…';
    case 'system-failure':
    case 'spotlight-active':
      return 'CRITICAL ERROR: Lighting module offline. Emergency power engaged.';
    case 'recovery-boot':
      return 'Restoring systems. Please wait…';
    case 'online':
      return lightsOn.value 
        ? 'All systems operational. Ready to explore.' 
        : 'Running on emergency power. Toggle lights to restore.';
    default:
      return 'Stand by…';
  }
});

// Terminal configuration based on phase
const terminalTitle = computed(() => {
  switch (phase.value) {
    case 'initial-boot':
      return 'boot.log';
    case 'system-failure':
    case 'spotlight-active':
      return 'error.log';
    case 'recovery-boot':
      return 'recovery.log';
    case 'online':
      return lightsOn.value ? 'system.log' : 'emergency.log';
    default:
      return 'system.log';
  }
});

const terminalVariant = computed<'default' | 'error' | 'success' | 'warning'>(() => {
  switch (phase.value) {
    case 'system-failure':
    case 'spotlight-active':
      return 'error';
    case 'recovery-boot':
      return 'warning';
    case 'online':
      return lightsOn.value ? 'success' : 'warning';
    default:
      return 'default';
  }
});

// =========================
// EVENT HANDLERS
// =========================

/**
 * Called when FaultyBootSequence fails at the lighting module
 */
const handleBootFailure = (lineIndex: number, failedLine: string) => {
  console.log(`[SYSTEM] Boot failed at line ${lineIndex}:`, failedLine);
  
  phase.value = 'system-failure';
  lightsOn.value = false;
  
  // After flicker animation, enable spotlight
  setTimeout(() => {
    phase.value = 'spotlight-active';
  }, 1000);
};

/**
 * Called when user activates the emergency power switch
 */
const handleEmergencyPowerActivated = () => {
  console.log('[SYSTEM] Emergency power activated, initiating recovery...');
  
  phase.value = 'recovery-boot';
  lightsOn.value = false; // Keep lights off during recovery
};

/**
 * Called when recovery boot sequence finishes
 */
const handleRecoveryComplete = () => {
  console.log('[SYSTEM] Recovery complete, system online');
  phase.value = 'online';
  lightsOn.value = true; // Restore lights
  showLightSwitch.value = true; // Now visitor can toggle lights manually
};

/**
 * Called when visitor toggles the light switch manually
 */
const handleLightToggle = (newState: boolean) => {
  console.log('[SYSTEM] Lights toggled:', newState ? 'ON' : 'OFF');
  // The v-model will update lightsOn automatically
};
</script>

<template>
  <UPage 
    id="cd-landing"
    class="center relative min-h-screen overflow-hidden grid grid-rows-[1fr_auto]"
    :class="[
      phase === 'system-failure' && 'flicker-effect',
      phase === 'recovery-boot' && 'flicker-effect'
    ]"
  >
    <!-- Background grid (always visible) -->
    <div
      class="absolute
      inset-0
      opacity-10
      bg-[linear-gradient(90deg,#fff2_1px,transparent_1px),linear-gradient(#fff2_1px,transparent_1px)]
      bg-size-[40px_40px]"
    />

    <!-- Spotlight Effect Component (only active when needed) -->
    <SpotlightEffect 
      :active="spotlightActive"
      :intensity="spotlightIntensity"
      :radius="250"
    />

    <!-- HERO SECTION -->
    <UPageHero
      :title="title"
      :description="description"
      class="z-30"
    >
      <template #headline>
        <div class="flex flex-col items-center">
          <Logo class="w-44 sm:w-56 h-auto mb-6 select-none" />
        </div>
      </template>

      <template #body>
        <!-- Terminal Container wraps ALL phases for consistent styling -->
        <Terminal
          :title="terminalTitle"
          :variant="terminalVariant"
          :show-chrome="true"
          max-height="400px"
          max-width="650px"
          :auto-scroll="true"
        >
          <!-- Phase 1: Initial faulty boot -->
          <FaultyBootSequence
            v-if="phase === 'initial-boot'"
            @boot-failed="handleBootFailure"
          />

          <!-- Phase 2: Spotlight active - show error message -->
          <div
            v-else-if="phase === 'spotlight-active'"
            class="terminal-phase-content"
          >
            <div class="text-red-400 space-y-2">
              <div class="font-bold">
                > ERROR: Lighting module unresponsive
              </div>
              <div>> Emergency spotlight mode enabled</div>
              <div class="mt-4 text-orange-400 animate-pulse">
                > Searching for backup power source...
              </div>
            </div>
          </div>

          <!-- Phase 3: Recovery boot sequence -->
          <BootSequence 
            v-else-if="phase === 'recovery-boot'"
            :lines="[
              '> Power restored. Rebooting systems…',
              '> Reinitializing lighting module…',
              '> Running diagnostics…',
              '> All systems nominal.',
              '> Welcome back.'
            ]"
            @finished="handleRecoveryComplete"
          />

          <!-- Phase 4: System fully online -->
          <div v-else-if="phase === 'online'" class="terminal-phase-content">
            <div 
              class="font-bold mb-3 transition-colors duration-300"
              :class="lightsOn ? 'text-green-400' : 'text-orange-400'"
            >
              {{ lightsOn ? '✓ System Online' : '⚠ Running on Emergency Power' }}
            </div>
            <div class="text-slate-300 text-sm">
              {{ lightsOn 
                ? '> All modules operational. Standing by.' 
                : '> Use the switch to restore lighting.' 
              }}
            </div>
          </div>
        </Terminal>
      </template>
    </UPageHero>

    <!-- Emergency power switch (during spotlight phase) -->
    <LightSwitch
      v-if="phase === 'spotlight-active'"
      :lights-on="false"
      mode="emergency"
      position="bottom-right"
      @toggle="handleEmergencyPowerActivated"
    />

    <!-- Manual light switch (only shown after recovery) -->
    <LightSwitch
      v-if="showLightSwitch && phase === 'online'"
      v-model:lights-on="lightsOn"
      mode="toggle"
      position="bottom-right"
      @toggle="handleLightToggle"
    />

    <!-- Footer (always visible) -->
    <AppFooter 
      class="relative z-30 border-t border-black/10 bg-transparent backdrop-blur-sm" 
    />
  </UPage>
</template>

<style scoped>
/* =========================
   FLICKER EFFECT
   ========================= */

@keyframes flicker {
  0%, 100% { opacity: 1; }
  10% { opacity: 0.3; }
  20% { opacity: 1; }
  30% { opacity: 0.5; }
  40% { opacity: 1; }
  50% { opacity: 0.2; }
  60% { opacity: 1; }
  70% { opacity: 0.6; }
  80% { opacity: 1; }
}

.flicker-effect {
  animation: flicker 1s ease-in-out;
}

/* =========================
   TERMINAL PHASE CONTENT
   ========================= */

.terminal-phase-content {
  font-family: monospace;
  font-size: 0.75rem;
  line-height: 1.6;
}
</style>