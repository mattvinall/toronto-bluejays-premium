<script setup lang="ts">
type Variant = 'primary' | 'ghost' | 'link'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
  variant?: Variant
  size?: Size
  as?: 'button' | 'a' | 'NuxtLink'
  to?: string
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  variant: 'primary',
  size: 'md',
  as: 'button',
  type: 'button'
})

const variantClasses: Record<Variant, string> = {
  primary: 'bg-jays-navy text-white hover:bg-jays-blue active:bg-jays-blue/90',
  ghost: 'bg-transparent text-jays-navy hover:bg-jays-navy/10',
  link: 'bg-transparent text-jays-navy underline underline-offset-4 hover:text-jays-blue'
}

const sizeClasses: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-14 px-7 text-lg'
}

const classes = computed(() => [
  'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200',
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jays-red',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  variantClasses[props.variant],
  sizeClasses[props.size]
])
</script>

<template>
  <NuxtLink v-if="as === 'NuxtLink' && to" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <a v-else-if="as === 'a' && href" :href="href" :class="classes">
    <slot />
  </a>
  <button v-else :type="type" :disabled="disabled" :class="classes">
    <slot />
  </button>
</template>
