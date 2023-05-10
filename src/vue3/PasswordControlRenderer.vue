<template>
  <control-wrapper
    v-bind="controlWrapper"
    :id="control.id + '-input'"
    :styles="styles"
    :is-focused="!!isFocused"
    :applied-options="appliedOptions"
  >
    <input
      :id="control.id + '-input'"
      v-model="control.data"
      :type="passwordVisible ? 'text' : 'password'"
      data-type="password"
      :class="styles.control.input"
      :disabled="!control.enabled"
      :autofocus="appliedOptions.focus"
      :placeholder="appliedOptions.placeholder"
      :required="control.required"
      @change="onChange"
    />

    <!--
      :maxlength="input.appliedOptions.restrict ?? control.schema.maxLength"
      :size="(input.appliedOptions.trim && control.schema.maxLength !== undefined )?? control.schema.maxLength"
    -->

    <button @click="passwordVisible = !passwordVisible"></button>
  </control-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  RendererProps,
  rendererProps,
  useJsonFormsControl,
} from '@jsonforms/vue';
import { ControlWrapper, useVanillaControl } from '@jsonforms/vue-vanilla';
import {
  formatIs,
  isStringControl,
  rankWith,
  and,
  JsonFormsRendererRegistryEntry,
  ControlElement,
} from '@jsonforms/core';

/**
 * https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/controls/PasswordControlRenderer.vue
 */
const renderer = defineComponent({
  components: {
    ControlWrapper,
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
    return {
      passwordVisible: false,
    };
  },
  computed: {},
});

export default renderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: renderer,
  tester: rankWith(2, and(isStringControl, formatIs('password'))),
};
</script>
