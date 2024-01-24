<template>

  <div :class="[styles.verticalLayout.root, styles.objectAddProps.items]">
    <div
        v-for="(element, index) in additionalPropertyItems"
        :key="`${index}`"
        :class="[styles.verticalLayout.item, styles.objectAddProps.item]"
    >
      <DispatchRenderer
          v-if="element.schema && element.uischema"
          :schema="element.schema"
          :uischema="element.uischema"
          :path="element.path"
          :enabled="control.enabled"
          :renderers="control.renderers"
          :cells="control.cells"
      />

      <!--  :disabled="removePropertyDisabled" -->
      <button
          v-if="control.enabled"
          :class="styles.objectAddProps.itemDeleteButton"
          @click="removeProperty(element.propertyName)"
          v-text="'x'"
      />
    </div>
  </div>

</template>


<script setup lang="ts">
import {onBeforeMount} from "vue";
import {DispatchRenderer, useJsonFormsControlWithDetail} from "@jsonforms/vue";
import {createAdditionProperties, injectAdditionalPropertyItems, useStylesByUischema} from "../../utils";

const props = defineProps<{
  input: ReturnType<typeof useJsonFormsControlWithDetail>
}>();

const control = props.input.control;

const additionalPropertyItems = injectAdditionalPropertyItems();
const styles = useStylesByUischema(control.value.uischema);

const removeProperty = (propName: string) => {
  additionalPropertyItems.value = additionalPropertyItems.value.filter((d: any) => d.propertyName !== propName);

  if ('object' === typeof control.value?.data) {
    delete control.value.data[propName];
    props.input.handleChange(control.value.path, control.value.data);
  }
};

onBeforeMount(() => {
  additionalPropertyItems.value = createAdditionProperties(control.value.schema, control.value?.data, control.value.path)
})

</script>.value
