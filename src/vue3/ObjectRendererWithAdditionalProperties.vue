<template>

  <div v-if="control.visible" :class="styles.objectAddProps.root">

    <fieldset v-if="control.visible" :class="styles.group.root">
      <legend v-if="control.label" :class="styles.group.label">
        {{ control.label }}
        <ButtonWithDialog :input="input" :class="styles.objectAddProps.button"/>
      </legend>

      <DispatchRenderer
          :visible="control.visible"
          :enabled="control.enabled"
          :schema="control.schema"
          :uischema="detailUiSchema"
          :path="control.path"
          :renderers="control.renderers"
          :cells="control.cells"
      />

      <ItemList
          v-if="showAdditionalProperties"
          :input="input"
      />

    </fieldset>
  </div>
</template>

<script lang="ts">
import {defineComponent, provide, ref, type Ref} from 'vue';
import {and, findUISchema, isObjectControl, rankWith, schemaMatches} from '@jsonforms/core';
import type {ControlElement, JsonFormsRendererRegistryEntry, UISchemaElement,} from '@jsonforms/core';
import {DispatchRenderer, type RendererProps, rendererProps, useJsonFormsControlWithDetail} from '@jsonforms/vue';
import {useVanillaControl} from '@jsonforms/vue-vanilla';
import {type AdditionalPropertyType, createAdditionProperties, useStylesByUischema} from "./utils";
import ItemList from "./components/AdditionalProperties/ItemList.vue";
import ButtonWithDialog from "./components/AdditionalProperties/ButtonWithDialog.vue";

const controlRenderer = defineComponent({
  name: 'ObjectRenderer',
  components: {
    DispatchRenderer,
    ButtonWithDialog,
    ItemList,
  },
  props: {
    ...rendererProps<ControlElement>(),
  },
  setup(props: RendererProps<ControlElement>) {
    const control = useVanillaControl(useJsonFormsControlWithDetail(props));

    const additionalPropertyItems: Ref<AdditionalPropertyType[]> = ref(createAdditionProperties(control.control.value.schema, control.control.value?.data, control.control.value.path));
    provide("additionalPropertyItems", additionalPropertyItems)

    const styles = useStylesByUischema(control.control.value.uischema);

    return {
      ...control,
      styles,
      input: control,
    };
  },
  computed: {
    showAdditionalProperties(): boolean {
      const show = this.control.uischema.options?.showAdditionalProperties;
      return show === undefined || show === true
    },
    detailUiSchema(): UISchemaElement {
      return findUISchema(
          this.control.uischemas,
          this.control.schema,
          this.control.uischema.scope,
          this.control.path,
          'VerticalLayout',
          this.control.uischema,
          this.control.rootSchema
      );
    },
  },
});

export default controlRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: controlRenderer,

  //must be higher then ObjectRenderer (is 3)
  tester: rankWith(4, and(isObjectControl, schemaMatches((schema) => {
    // do not support - additionalProperties === true - since then the type should be any and we won't know what kind of renderer we should use for new properties
    const enabled = "additionalProperties" in schema && false !== schema?.additionalProperties;
    const isObject = enabled && 'object' === typeof schema?.additionalProperties;
    const hasPatternProperties = enabled && !isObject && !!Object.keys(schema?.patternProperties ?? {}).length;

    return isObject || hasPatternProperties
  }))),
};
</script>
