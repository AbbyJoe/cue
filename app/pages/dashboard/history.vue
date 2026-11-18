<template>
  <section class="mx-auto max-w-6xl">
    <PageHeader title="Past interviews" description="Every completed voice session, with its transcript and assessment." />
    <div class="mt-8">
      <EmptyState
        icon="Clock"
        title="No interviews yet"
        description="Completed voice sessions will be listed here, with the role, the category, and the date."
      >
        <Button to="/dashboard/practise">
          <Icon name="Microphone2" :size="18" />
          Practise an interview
        </Button>
      </EmptyState>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'app' })
useHead({ title: 'History' })
</script>
