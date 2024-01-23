<template>
  <ControlWrapper
      v-bind="controlWrapper"
      :styles="styles"
      :is-focused="isFocused"
      :applied-options="appliedOptions"
  >
    <div :class="styles?.controlWithTypes?.root">
      <DispatchRenderer
          :visible="control.visible"
          :enabled="control.enabled"
          :schema="newSchema?.schema"
          :uischema="newSchema?.uischema"
          :path="control.path"
          :renderers="control.renderers"
          :cells="control.cells"
      />
    </div>
  </ControlWrapper>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import {and, rankWith, schemaMatches, uiTypeIs} from '@jsonforms/core';
import type {ControlElement, JsonFormsRendererRegistryEntry} from '@jsonforms/core';
import {DispatchRenderer, rendererProps, useJsonFormsControl, type RendererProps} from '@jsonforms/vue';
import {ControlWrapper, useVanillaControl} from '@jsonforms/vue-vanilla';

const renderer = defineComponent({
  components: {
    DispatchRenderer,
    ControlWrapper
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    return useVanillaControl(
        useJsonFormsControl(props),
        (target) => target.value || undefined
    );
  },
  data() {
    return {};
  },
  computed: {
    newSchema() {
      const types = this.control.schema?.type as string[];
      let schema = {
        oneOf: types?.map(type => {
          return {
            type: type,
            title: type
          }
        })
      }

      return {
        schema,
        uischema: {type: 'Control', scope: '#'}
      }
    },
  },
});

export default renderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: renderer,
  tester: rankWith(2, and(
      uiTypeIs('Control'),
      schemaMatches((schema) => Array.isArray(schema?.type))
  )),
};
</script>
