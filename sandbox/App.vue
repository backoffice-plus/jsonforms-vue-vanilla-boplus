<template>

  <h1 style="text-align: center">JSON Forms Vue Vanilla Renderer by backoffice.plus</h1>

  <section>

    <article class="withoutBo">
      <h2>Jsonforms Vue Vanilla</h2>
      <JsonForms
          :schema="jf.schema"
          :uischema="jf.uischema"
          :data="jf.data ?? {}"
          :renderers="vanillaRenderers"
          :i18n="i18n"
      />
    </article>

    <article class="withBo">
      <h2>Bo+ Renderers</h2>
      <JsonForms
          :schema="jf.schema"
          :uischema="jf.uischema"
          :data="jf.data ?? {}"
          :renderers="renderersBop"
          :i18n="i18n"
      />
    </article>

  </section>

  <section class="content">
    <div>
      <details>
        <summary>Schema & Ui Schema</summary>
        <textarea readonly disabled>{{jfDefault}}</textarea>
      </details>
    </div>
  </section>

</template>


<style scoped>
section {
  display: grid;
  grid-template-columns: minmax(20px,1fr) minmax(300px,40%) minmax(300px,40%) minmax(20px,1fr);
  grid-template-areas:
    ". form1 form2 .";
  grid-gap: 2rem;
}
section article {
  background-color: #f6f7fa;
  border:1px solid #eee;
  padding:2rem;
  padding-top:0;
}

section article.withBo {
  grid-area: form1;
}
section article.withoutBo {
  grid-area: form2;
}

section.content {
  grid-template-areas: ". content content ."
}
section.content > * {
  grid-area: content;
}

details textarea {
  width: 100%;
  aspect-ratio: 5/2;
  font-family: monospace;
}
</style>

<script setup lang="ts">
import type {JsonFormsRendererRegistryEntry} from "@jsonforms/core";
import {JsonForms, type MaybeReadonly} from "@jsonforms/vue";
import {vanillaRenderers} from "@jsonforms/vue-vanilla";
import boplusVueVanillaRenderers from "../src/vue3/index";
import jfDefault from "./jsonforms/default.forms.json";
import jfAddProps from "./jsonforms/object_additional_properties.forms.json";

const jf = jfDefault;//jfAddProps;//jfDefault

const renderers:MaybeReadonly<JsonFormsRendererRegistryEntry[]> = Object.freeze([
  ...vanillaRenderers,
]);
const renderersBop:MaybeReadonly<JsonFormsRendererRegistryEntry[]> = Object.freeze([
  ...vanillaRenderers,
  ...boplusVueVanillaRenderers,
]);

const catalogueDe:Record<string, string> = {
  next:"weiter",
  back:"zurück",
};
const i18n = {
  locale: "de",
  translate: (key:string, defaultMessage?:string) => catalogueDe[key] ?? defaultMessage,
}
</script>


