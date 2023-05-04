<template>

  <div :class="styles.categorization.root">

    <div :class="styles.categorization.category">

      <div
          v-for="(item, index) in categories"
          :key="`tab-${index}`"
          @click="selected=index"
      >
        <!--
        :TODO add translation
"type": "Category",
"label": "categoryLabelKey",
"i18n": "address",
        -->

        <button
            :class="[selected===index?styles.categorization.selected:'']"
            :disabled="!item.isEnabled"
        >
<!--          {{ item.element.i18n ? item.element.i18n : item.element.label }}-->
          {{ item.element.label }}
        </button>

      </div>

    </div>

    <div :class="styles.categorization.panel">
      <dispatch-renderer
        :schema="layout.schema"
        :uischema="currentUischema"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </div>

  </div>

</template>


<script lang="ts">
import {defineComponent} from 'vue';
import {isVisible,  rankWith,  createAjv, isEnabled, and, categorizationHasCategory, uiTypeIs} from '@jsonforms/core';
import type {JsonFormsRendererRegistryEntry, Layout, Category, Categorization, UISchemaElement} from '@jsonforms/core';
import {rendererProps, useJsonFormsLayout, DispatchRenderer} from '@jsonforms/vue';
import type {RendererProps} from '@jsonforms/vue';
import {ControlWrapper} from "@jsonforms/vue-vanilla";
import {useBoPlusLayout} from "./utils";


/**
 * @see https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/layouts/CategorizationRenderer.vue
 */

const layoutRenderer = defineComponent({
  name: 'categorization-renderer',
  components: {
    ControlWrapper,
    DispatchRenderer
  },
  props: {
    ...rendererProps<Layout>()
  },
  data() {
    return {
      selected: 0
    }
  },
  setup(props: RendererProps<Layout>) {
    //const activeCategory = ref(0);
    const ajv = createAjv();
    //const t = useTranslator();
    return {
      ...useBoPlusLayout(useJsonFormsLayout(props)),
      //activeCategory,
      ajv,
      //t,
    };
  },

  computed: {
    currentUischema():UISchemaElement {
      return this.categories[this.selected].element
    },
    categories(): any {
      return (this.layout.uischema as Categorization).elements
        .filter((category: Category | Categorization) => isVisible(category, this.layout.data, this.layout.path, this.ajv))
        .map((category: Category | Categorization) => {
          return {
            element: category,
            isEnabled: isEnabled(category, this.layout.data, this.layout.path, this.ajv)
          }
        });
    }
  }
});

export default layoutRenderer;
export const entry: JsonFormsRendererRegistryEntry = {
  renderer: layoutRenderer,
  tester: rankWith(2, and(uiTypeIs('Categorization'), categorizationHasCategory)),
};


</script>
