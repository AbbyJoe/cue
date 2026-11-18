<template>
  <section class="mx-auto max-w-6xl">
    <PageHeader
      title="How answers are evaluated"
      description="These lessons teach how to think through an answer. They are not scripts to memorise."
    />

    <div v-for="group in groups" :key="group.category" class="mt-10">
      <h2 class="text-base font-semibold">{{ group.category }}</h2>
      <ul class="mt-3 grid gap-3 md:grid-cols-2">
        <li v-for="lesson in group.items" :key="lesson.slug">
          <NuxtLink
            :to="`/dashboard/learning/${lesson.slug}`"
            class="card group flex h-full items-start gap-4 px-5 py-[1.1rem] transition-colors duration-150 hover:border-line-strong hover:bg-surface-hover"
          >
            <span class="grid h-9 w-9 flex-none place-items-center rounded-[0.65rem] border border-line-strong bg-elevated text-ink-soft transition-colors duration-150 group-hover:border-accent-solid group-hover:bg-accent-solid group-hover:text-white">
              <Icon name="Book1" :size="18" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block font-medium text-ink">{{ lesson.title }}</span>
              <span class="mt-1 block text-sm leading-5 text-ink-soft">{{ lesson.summary }}</span>
            </span>
            <Icon
              name="ArrowRight2"
              :size="16"
              class="mt-2.5 text-ink-faint transition duration-150 group-hover:translate-x-[3px] group-hover:text-ink"
            />
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>

<script setup lang="ts">
import { lessonsByCategory } from '~/data/lessons'

definePageMeta({ layout: 'app' })
useHead({ title: 'Learning' })

const groups = lessonsByCategory()
</script>
