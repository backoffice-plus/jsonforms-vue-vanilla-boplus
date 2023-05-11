<template>

    <control-wrapper
            v-bind="controlWrapper"
            :styles="styles"
            :isFocused="!!isFocused"
            :appliedOptions="appliedOptions"
    >
        <input
                type="search"
                :id="control.id + '-select'"
                :list="control.id + '-datalist'"
                :class="styles.control.select"
                :value="control.data"
                :disabled="!control.enabled"
                :autofocus="appliedOptions.focus"
                @change="onChange"
                @focus="isFocused = true"
                @blur="isFocused = false"
        />
        <datalist
                :id="control.id + '-datalist'"
        >
            <option
                    v-for="optionElement in control.options"
                    :value="optionElement.value"
                    :class="styles.control.option"
                    :key="optionElement.value"
            >
                {{ optionElement.label }}
            </option>
            <!--
                :label="optionElement.label"
            -->
        </datalist>

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
 * https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/extended/AutocompleteEnumControlRenderer.vue
 * https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/extended/AutocompleteOneOfEnumControlRenderer.vue
 */


const controlRenderer = defineComponent({
    name: 'autocomplete-enum-control-renderer',
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
    tester: rankWith(10, and(or(isEnumControl, isOneOfEnumControl), optionIs('autocomplete', true)))
};
</script>



