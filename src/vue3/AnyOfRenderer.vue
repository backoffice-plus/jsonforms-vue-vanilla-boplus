<template>
  <div v-if="control.visible">
    <CombinatorProperties
      :schema="control.schema"
      combinator-keyword="anyOf"
      :path="path"
    />

  <div :class="styles.anyOf.root">
      <div :class="styles.anyOf.category">
        <div
          v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos"
          :key="`${control.path}-${anyOfIndex}`"
          @click="selectedIndex = anyOfIndex"
        >
          <!--  :class="styles.categorization.selected" -->
          <button :class="{ selected: selectedIndex === anyOfIndex }">
            {{ anyOfRenderInfo.label }}
          </button>
        </div>
      </div>

      <div :class="styles.anyOf.panel">
        <template v-for="(anyOfRenderInfo, anyOfIndex) in anyOfRenderInfos">
          <dispatch-renderer
            v-if="selectedIndex === anyOfIndex"
            :key="`${control.path}-${anyOfIndex}`"
            :schema="anyOfRenderInfo.schema"
            :uischema="anyOfRenderInfo.uischema"
            :path="control.path"
            :renderers="control.renderers"
            :cells="control.cells"
            :enabled="control.enabled"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import {
  createCombinatorRenderInfos,
  isAnyOfControl,
  rankWith,
} from '@jsonforms/core';
import type {
  CombinatorSubSchemaRenderInfo,
  ControlElement,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsAnyOfControl,
} from '@jsonforms/vue';
import type { RendererProps } from '@jsonforms/vue';
import CombinatorProperties from './components/CombinatorProperties.vue';
import {useBoPlusVanillaControl} from "./utils";

const controlRenderer = defineComponent({
  name: 'AnyOfRenderer',
  components: {
    DispatchRenderer,
    CombinatorProperties,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const input = useJsonFormsAnyOfControl(props);
    const control = input.control.value;
    const selectedIndex = ref(control.indexOfFittingSchema || 0);
    return {
      ...useBoPlusVanillaControl(input),
      selectedIndex,
    };
  },
  computed: {
    anyOfRenderInfos(): CombinatorSubSchemaRenderInfo[] {
      const result = createCombinatorRenderInfos(
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.control.schema.anyOf!,
        this.control.rootSchema,
        'anyOf',
        this.control.uischema,
        this.control.path,
        this.control.uischemas
      );
      return result.filter((info) => info.uischema);
    },
  },
});
export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(3, isAnyOfControl),
};
</script>
