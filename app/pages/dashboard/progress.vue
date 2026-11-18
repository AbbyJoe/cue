<template>
  <section class="mx-auto max-w-6xl">
    <PageHeader title="Improvement over time" description="Compared across repeated attempts of the same kind of interview." />
    <div class="mt-8">
      <EmptyState
        icon="Chart2"
        title="Nothing to compare yet"
        description="Progress comes from repeating the same kind of interview and reading the evidence. It will not average unrelated scores."
      >
        <Button to="/dashboard/practise">
          Start a session
        </Button>
      </EmptyState>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'Progress' })
</script>
