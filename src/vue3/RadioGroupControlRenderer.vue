<template>

    <control-wrapper
            v-bind="controlWrapper"
            :styles="styles"
            :isFocused="isFocused"
            :appliedOptions="appliedOptions"
    >

<!--       <label :for="control.id + '-input'">{{ computedLabel }}</label>-->

        <div
                :id="control.id + '-input'"
                :class="styles.control.input"
        >
            <div
                    v-for="o in control.options"
                    :key="o.value"
            >
                <input type="radio"
                       :id="control.id +'.'+ o.value"
                       :name="control.id"
                       :value="o.value"
                       :disabled="!control.enabled"
                       :required="control.required"
                       @change="onChange"
                />

                <label :for="control.id +'.'+ o.value">{{ o.label }}</label>

            </div>

        </div>

    </control-wrapper>

</template>

<script lang="ts">
import {defineComponent} from "vue";
import type {ControlElement, JsonFormsRendererRegistryEntry} from '@jsonforms/core';
import {and, isEnumControl, isOneOfEnumControl, optionIs, or, rankWith} from "@jsonforms/core";
import type {RendererProps} from '@jsonforms/vue';
import {rendererProps, useJsonFormsEnumControl, useJsonFormsOneOfEnumControl} from '@jsonforms/vue';
import {ControlWrapper} from "@jsonforms/vue-vanilla";
import {useBoPlusVanillaControl} from "./utils";

/**
 * @see https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/controls/RadioGroupControlRenderer.vue
 * @see https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/controls/OneOfRadioGroupControlRenderer.vue
 */

const controlRenderer = defineComponent({
    name: 'radio-group-control-renderer',
    components: {
        ControlWrapper
    },
    props: {
        ...rendererProps<ControlElement>(),
    },
    setup(props: RendererProps<ControlElement>) {
        let input = useJsonFormsEnumControl(props);

        /** @ts-ignore **/
        if (undefined !== input.control.value?.schema?.oneOf) {
            input = useJsonFormsOneOfEnumControl(props);
        }

        return useBoPlusVanillaControl(input);
    },
});

export default controlRenderer;

export const entry: JsonFormsRendererRegistryEntry = {
    renderer: controlRenderer,
    tester: rankWith(20, and(or(isEnumControl, isOneOfEnumControl), optionIs('format', 'radio'))),
};
</script>



