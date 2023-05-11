<template>
  <control-wrapper
    v-bind="controlWrapper"
    :styles="styles"
    :is-focused="isFocused"
    :applied-options="appliedOptions"
  >
    <label :class="styles.toggle.root" :for="control.id + '-input'">
      <input
        :id="control.id + '-input'"
        type="checkbox"
        :class="styles.control.input"
        :disabled="!control.enabled"
        :autofocus="appliedOptions.focus"
        :checked="control.data"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @change="onChange"
      />
      <!--
        ref="checkbox"
        :label="computedLabel"
        :hint="control.description"
        :persistent-hint="persistentHint()"
        :error-messages="control.errors"
        :input-value="control.data"
        :true-value="true"
        :false-value="false"
        -->

        <span :class="styles.toggle.slider" />
    </label>
  </control-wrapper>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { rankWith, and, isBooleanControl, optionIs } from '@jsonforms/core';
import type {
  ControlElement,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import type { RendererProps } from '@jsonforms/vue';
import { ControlWrapper } from '@jsonforms/vue-vanilla';
import { useBoPlusVanillaControl } from './utils';

const controlRenderer = defineComponent({
  name: 'ToggleControlRenderer',
  components: {
    ControlWrapper,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useBoPlusVanillaControl(
      useJsonFormsControl(props),
      (value) => value.checked
    );

    return {
      ...control,
    };
  },
});
export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,
  tester: rankWith(3, and(isBooleanControl, optionIs('toggle', true))),
};
</script>

<style>
:root {
    --slider-margin: 2px;
    --slider-height: 14px;
    --bop-booleanToogle-slider: #fff;
    --bop-booleanToogle-background: #9ca3af;
    --bop-booleanToogle-background-active: #0284c7;
}
</style>
<style scoped>
.toggle {
    aspect-ratio: 16/9;
    height: var(--slider-height);
    position: relative;
    display: inline-block;
}

.toggle input {
    visibility: hidden;
    width: 0;
    height: 0;
}

.toggle .slider {
    position: absolute;
    inset: 0;
    cursor: pointer;
    border-radius: 9999px;
}

.toggle .slider:before {
    content: "";
    left: var(--slider-margin);
    top: var(--slider-margin);
    bottom: var(--slider-margin);

    position: absolute;
    border-radius: 9999px;
    aspect-ratio: 1 / 1;
}


.toggle:has(input:disabled)  {
    opacity: 0.5;
}
.toggle:has(input:disabled) .slider  {
    cursor: default;
}

/*
 * Colors
 */
.toggle .slider {
    background-color: var(--bop-booleanToogle-background);
}

.toggle .slider:before {
    background-color: var(--bop-booleanToogle-slider);
}

.toggle input:checked + .slider {
    background-color: var(--bop-booleanToogle-background-active);
}


/*
 * transition
 */
.toggle .slider {
    transition-property: background-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;
}

.toggle .slider:before {
    transition-duration: 300ms;
}

.toggle input:checked + .slider:before {
    left: 100%;
    transform: translateX(calc(-100% - var(--slider-margin)));
}

</style>
