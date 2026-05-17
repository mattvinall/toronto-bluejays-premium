<script setup lang="ts">
import { resolveComponent } from 'vue'

type Variant = 'primary' | 'ghost' | 'link' | 'accent' | 'on-dark'
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
  link: 'bg-transparent text-jays-navy underline underline-offset-4 hover:text-jays-blue',
  accent: 'bg-jays-red text-white hover:bg-jays-red/90 active:bg-jays-red/80',
  'on-dark': 'bg-white/10 text-white border border-white/40 hover:bg-white/20'
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

const tag = computed(() => {
  if (props.as === 'NuxtLink' && props.to) return resolveComponent('NuxtLink')
  if (props.as === 'a' && props.href) return 'a'
  return 'button'
})

const extraProps = computed(() => {
  if (props.as === 'NuxtLink' && props.to) return { to: props.to }
  if (props.as === 'a' && props.href) return { href: props.href }
  return { type: props.type, disabled: props.disabled }
})
</script>

<template>
  <component :is="tag" v-bind="extraProps" :class="classes">
    <slot />
  </component>
</template>
