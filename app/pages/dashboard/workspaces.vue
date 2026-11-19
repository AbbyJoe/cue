<template>
  <PageLoading v-if="pending" />
  <section v-else class="mx-auto max-w-6xl">
    <PageHeader
      title="Workspaces"
      description="Each workspace is one role or company. Its interviews, scores, and job description stay separate."
    />

    <p v-if="loadError" class="mt-8 text-sm text-danger">
      {{ loadError }}
    </p>

    <div
      v-else
      class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]"
    >
      <div
        class="grid min-w-0 content-start gap-3 self-start lg:sticky lg:top-20 lg:max-h-[calc(100dvh-6.5rem)] lg:overflow-y-auto"
      >
        <!-- General practice: sessions outside any workspace -->
        <button
          type="button"
          :class="cardClass(activeId === null)"
          :aria-pressed="activeId === null"
          @click="choose(null)"
        >
          <span class="flex items-start gap-3">
            <span
              class="grid h-10 w-10 flex-none place-items-center rounded-xl bg-sunken text-ink-soft"
            >
              <Icon name="Category" :size="20" />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block text-sm font-semibold">General practice</span>
              <span class="mt-0.5 block text-[13px] text-ink-soft"
                >Sessions that aren’t filed under a workspace.</span
              >
            </span>
          </span>
        </button>

        <article
          v-for="workspace in workspaces"
          :key="workspace.id"
          :class="cardClass(activeId === workspace.id)"
        >
          <!-- Main area: click to make this the active workspace -->
          <button
            type="button"
            class="flex w-full min-w-0 items-start gap-3 text-left"
            :aria-pressed="activeId === workspace.id"
            @click="choose(workspace.id)"
          >
            <span
              :class="[
                'grid h-10 w-10 flex-none place-items-center rounded-xl text-[13px] font-semibold text-ink',
                tint(workspace.id),
              ]"
            >
              {{ initials(workspace.name) }}
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate text-sm font-semibold">{{
                workspace.name
              }}</span>
              <span
                class="mt-0.5 flex min-w-0 items-center gap-1.5 text-[13px] text-ink-soft"
              >
                <Icon
                  name="Briefcase"
                  :size="14"
                  class="flex-none text-ink-faint"
                />
                <span class="truncate"
                  >{{ labelFor("role", workspace.role) }} ·
                  {{ labelFor("level", workspace.level) }}</span
                >
              </span>
            </span>
          </button>

          <!-- What this workspace has -->
          <div class="mt-3 flex flex-wrap gap-1.5 pl-[3.25rem]">
            <span
              class="chip max-w-full"
              :title="workspace.cvName || 'Uses the CV from Settings'"
            >
              <Icon name="DocumentText" :size="13" class="flex-none" />
              <span class="truncate">{{
                workspace.cvName || "Profile CV"
              }}</span>
            </span>
          </div>

          <!-- Footer: date and actions. Delete asks once before removing. -->
          <div
            class="mt-4 flex min-h-8 items-center justify-between gap-3 border-t border-line pt-3"
          >
            <p
              v-if="removing === workspace.id"
              class="text-[13px] font-medium text-danger"
            >
              Delete this workspace?
            </p>
            <p v-else class="text-xs text-ink-faint">
              Created {{ formatDate(workspace.createdAt) }}
            </p>

            <div v-if="removing === workspace.id" class="flex gap-1.5">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                @click="removing = null"
              >
                <Icon name="CloseCircle" :size="15" />
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                :loading="busy"
                @click="confirmRemove(workspace.id)"
              >
                <Icon v-if="!busy" name="Trash" :size="15" />
                Delete
              </Button>
            </div>
            <div v-else class="flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                :disabled="editing === workspace.id"
                @click="edit(workspace)"
              >
                <Icon name="Edit2" :size="15" />
                {{ editing === workspace.id ? "Editing" : "Edit" }}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="hover:!bg-danger-soft hover:!text-danger"
                @click="removing = workspace.id"
              >
                <Icon name="Trash" :size="15" />
                Delete
              </Button>
            </div>
          </div>
        </article>
      </div>

      <form
        class="card grid min-w-0 content-start gap-5 self-start p-6"
        @submit.prevent="submit"
      >
        <h2 class="text-base font-semibold">
          {{ editing ? "Edit workspace" : "New workspace" }}
        </h2>
        <Field
          id="workspace-name"
          v-model="form.name"
          label="Name"
          placeholder="Acme — Senior Frontend"
          :error="nameError"
        />
        <Select
          id="workspace-role"
          v-model="form.role"
          label="Role"
          :options="roles"
        />
        <Select
          id="workspace-level"
          v-model="form.level"
          label="Experience level"
          :options="levels"
        />
        <div>
          <label
            for="workspace-goals"
            class="mb-1.5 block text-[13px] font-medium text-ink"
            >Goals</label
          >
          <textarea
            id="workspace-goals"
            v-model="form.goals"
            rows="3"
            maxlength="1000"
            class="field"
            placeholder="Explain trade-offs more clearly."
          />
        </div>
        <div>
          <label
            for="workspace-job"
            class="mb-1.5 block text-[13px] font-medium text-ink"
            >Job description</label
          >
          <textarea
            id="workspace-job"
            v-model="form.jobDescription"
            rows="5"
            maxlength="4000"
            class="field"
            placeholder="Paste the role you are preparing for."
          />
        </div>
        <div>
          <FileUpload
            id="workspace-cv"
            label="CV (optional)"
            :file="cvDisplay"
            :busy="busy"
            @select="onCvSelect"
            @remove="onCvRemove"
          />
        </div>
        <div class="flex flex-wrap gap-3">
          <Button type="submit" :loading="busy">{{
            editing ? "Save changes" : "Create workspace"
          }}</Button>
          <Button
            v-if="editing"
            type="button"
            variant="secondary"
            @click="cancelEdit"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ProfileCv } from "#shared/types/profile";
import type { Workspace } from "#shared/types/workspace";
import { labelFor, levels, roles } from "~/utils/interview";

definePageMeta({ layout: "app" });
useHead({ title: "Workspaces" });

const toast = useToast();
const { load: loadProfile } = useProfile();
const {
  workspaces,
  activeId,
  load,
  create,
  save,
  remove,
  open,
  uploadCv,
  clearCv,
} = useWorkspaces();

const pending = ref(true);
const busy = ref(false);
const loadError = ref("");
const nameError = ref("");
const editing = ref<string | null>(null);
const removing = ref<string | null>(null);
const form = reactive({
  name: "",
  role: "",
  level: "",
  goals: "",
  jobDescription: "",
  cvName: "",
});
const cvFile = ref<File | null>(null);
const cvPreviewUrl = ref("");
const forgetCv = ref(false);
const cvDisplay = computed<ProfileCv | null>(() => {
  if (forgetCv.value) {
    return null;
  }
  if (cvFile.value) {
    return {
      name: cvFile.value.name,
      size: cvFile.value.size,
      uploadedAt: new Date().toISOString(),
      url: cvPreviewUrl.value,
    };
  }
  if (form.cvName) {
    return { name: form.cvName, size: 0, uploadedAt: "", url: "" };
  }
  return null;
});
const defaults = { role: "", level: "", goals: "", jobDescription: "" };

function cardClass(selected: boolean) {
  return [
    "block w-full min-w-0 rounded-2xl border p-4 text-left transition-[border-color,box-shadow,background-color] duration-150",
    selected
      ? "border-accent bg-accent-soft/40 shadow-[0_0_0_3px_rgba(47,107,255,0.08)]"
      : "border-line bg-surface hover:border-line-strong hover:shadow-xs",
  ];
}
// Each workspace keeps the same pastel, picked from its id.
const tints = [
  "bg-aura-peach",
  "bg-aura-sky",
  "bg-aura-mint",
  "bg-aura-sun",
  "bg-aura-lilac",
];
function tint(id: string) {
  const sum = [...id].reduce((total, char) => total + char.charCodeAt(0), 0);
  return tints[sum % tints.length];
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]!.toUpperCase())
      .join("") || "W"
  );
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? "recently"
    : date.toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

function remember(
  profile?: {
    specialisation: string;
    level: string;
    goals: string;
    jobDescription: string;
  } | null,
) {
  if (!profile) {
    return;
  }
  defaults.role = roles.some(
    (option) => option.value === profile.specialisation,
  )
    ? profile.specialisation
    : "";
  defaults.level = levels.some((option) => option.value === profile.level)
    ? profile.level
    : "";
  defaults.goals = profile.goals;
  defaults.jobDescription = profile.jobDescription;
}

function resetForm() {
  editing.value = null;
  nameError.value = "";
  form.name = "";
  form.role = defaults.role;
  form.level = defaults.level;
  form.goals = defaults.goals;
  form.jobDescription = defaults.jobDescription;
  form.cvName = "";
  clearPickedCv();
}

function clearPickedCv() {
  if (cvPreviewUrl.value) {
    URL.revokeObjectURL(cvPreviewUrl.value);
  }
  cvPreviewUrl.value = "";
  cvFile.value = null;
  forgetCv.value = false;
}

function onCvSelect(file: File) {
  clearPickedCv();
  cvFile.value = file;
  cvPreviewUrl.value = URL.createObjectURL(file);
}

function onCvRemove() {
  clearPickedCv();
  forgetCv.value = true;
}

function cancelEdit() {
  resetForm();
}

function edit(workspace: Workspace) {
  editing.value = workspace.id;
  removing.value = null;
  nameError.value = "";
  form.name = workspace.name;
  form.role = workspace.role;
  form.level = workspace.level;
  form.goals = workspace.goals;
  form.jobDescription = workspace.jobDescription;
  form.cvName = workspace.cvName;
  clearPickedCv();
}

async function choose(id: string | null) {
  if (id === activeId.value) {
    return;
  }
  busy.value = true;
  try {
    await open(id);
  } catch {
    toast.error("Couldn’t switch workspace");
  } finally {
    busy.value = false;
  }
}

async function submit() {
  nameError.value = form.name.trim() ? "" : "Give the workspace a name.";
  if (nameError.value) {
    return;
  }
  busy.value = true;
  try {
    const input = {
      name: form.name.trim(),
      role: form.role,
      level: form.level,
      goals: form.goals,
      jobDescription: form.jobDescription,
    };
    const creating = !editing.value;
    let id = editing.value;
    if (id) {
      await save(id, input);
    } else {
      id = await create(input);
      editing.value = id;
    }
    if (!id) {
      throw new Error("The workspace was not created.");
    }
    if (cvFile.value) {
      await uploadCv(id, cvFile.value);
    } else if (forgetCv.value) {
      await clearCv(id);
    }
    toast.success(creating ? "Workspace created" : "Workspace saved");
    remember(await loadProfile().catch(() => null));
    resetForm();
  } catch (error) {
    const message = (error as { statusMessage?: string }).statusMessage;
    toast.error(message || "Couldn’t save the workspace");
  } finally {
    busy.value = false;
  }
}

async function confirmRemove(id: string) {
  busy.value = true;
  try {
    await remove(id);
    if (editing.value === id) {
      resetForm();
    }
    removing.value = null;
    toast.success("Workspace deleted");
  } catch {
    toast.error("Couldn’t delete the workspace");
  } finally {
    busy.value = false;
  }
}

onBeforeUnmount(() => {
  if (cvPreviewUrl.value) {
    URL.revokeObjectURL(cvPreviewUrl.value);
  }
});

onMounted(async () => {
  try {
    await load();
    remember(await loadProfile().catch(() => null));
    if (!editing.value) {
      resetForm();
    }
  } catch (error) {
    loadError.value =
      (error as { statusMessage?: string }).statusMessage ||
      "Could not load workspaces.";
  } finally {
    pending.value = false;
  }
});
</script>
