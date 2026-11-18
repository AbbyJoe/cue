<template>
  <section v-if="lesson" class="mx-auto max-w-3xl">
    <div class="flex items-center gap-2">
      <NuxtLink
        to="/dashboard/learning"
        class="inline-flex items-center gap-2 text-sm text-ink-soft hover:text-ink"
      >
        <Icon name="ArrowLeft2" :size="16" />
        Learning
      </NuxtLink>
      <p class="badge">{{ lesson.category }}</p>
    </div>

    <h1 class="mt-3 text-[1.75rem] font-semibold leading-9 tracking-tight">
      {{ lesson.title }}
    </h1>

    <div class="mt-8 space-y-8">
      <section>
        <h2 class="text-base font-semibold">Purpose</h2>
        <p class="mt-2 text-ink-soft">{{ lesson.purpose }}</p>
      </section>
      <section>
        <h2 class="text-base font-semibold">
          What the interviewer is evaluating
        </h2>
        <p class="mt-2 text-ink-soft">{{ lesson.evaluates }}</p>
      </section>
      <section>
        <h2 class="text-base font-semibold">Common mistakes</h2>
        <ul class="mt-2 list-disc space-y-1 pl-5 text-ink-soft">
          <li v-for="mistake in lesson.mistakes" :key="mistake">
            {{ mistake }}
          </li>
        </ul>
      </section>
      <section>
        <h2 class="text-base font-semibold">A useful structure</h2>
        <ol class="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
          <li v-for="step in lesson.structure" :key="step">{{ step }}</li>
        </ol>
      </section>
      <section class="card p-5">
        <h2 class="text-base font-semibold">An illustration</h2>
        <p class="mt-1 text-[13px] text-ink-faint">
          This shows a shape. It is not the answer you should memorise.
        </p>
        <p class="mt-3 text-ink-soft">{{ lesson.example }}</p>
      </section>
      <section>
        <h2 class="text-base font-semibold">Practice</h2>
        <p class="mt-2 text-ink-soft">{{ lesson.exercise }}</p>
        <Button to="/dashboard/practise" class="mt-5">
          Practise out loud
        </Button>
      </section>
    </div>
  </section>
  <section v-else class="mx-auto max-w-3xl">
    <h1 class="text-[1.75rem] font-semibold">Lesson not found</h1>
    <Button to="/dashboard/learning" class="mt-6" variant="secondary">
      Back to learning
    </Button>
  </section>
</template>

<script setup lang="ts">
import { lessonBySlug } from "~/data/lessons";

definePageMeta({ layout: "app" });

const route = useRoute();
const slug = computed(() => String(route.params.slug));
const lesson = computed(() => lessonBySlug(slug.value));

useHead({ title: () => lesson.value?.title ?? "Lesson" });
</script>
