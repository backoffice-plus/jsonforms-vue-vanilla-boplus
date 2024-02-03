# BO+ Vue Vanilla Renderer 

This is a set of vanilla renderers for JSON Forms 3.2 for Vue 3. Most renderers are direct ports from the [Vue 2 Vuetify renderer set](https://github.com/eclipsesource/jsonforms-vuetify-renderers) and thus fill the gap of missing renderers from the [Vue 3 Vanilla renderer set](https://github.com/eclipsesource/jsonforms/tree/master/packages/vue-vanilla).

For JSON Forms 3.0, here is an older version that still contains the Object and OneOf Renderer https://github.com/backoffice-plus/jsonforms-vue-vanilla-boplus/tree/v0.0.10

## Installation
Using npm:
```shell
$ npm install @backoffice-plus/jsonforms-vue-vanilla
```

## Usage
```js

import {vanillaRenderers} from "@jsonforms/vue-vanilla";
import {boplusVanillaRenderers} from "@backoffice-plus/jsonforms-vue-vanilla";

const jsonFormRenderers = Object.freeze([
    ...vanillaRenderers,
    ...boplusVanillaRenderers,
]);

```

## Renderer sets

https://jsonforms.io/docs/renderer-sets

| JSON Schema               | Renderer         | overruled Renderer | Vue Vanilla | Vue2 Vuetify | Bo+ Vue Vanilla |
|---------------------------|------------------|:------------------:|:-----------:|:------------:|:---------------:|
| boolean                   | Toggle           |      Boolean       |      ❌      |      ✔️      |       ✔️        |
| integer                   | Slider           |      Integer       |      ❌      |      ✔️      |       ✔️        |
| string                    | Password         |       String       |      ❌      |      ✔️      |       ✔️        |
| Enum                      | Autocomplete     |        Enum        |      ❌      |      ✔️      |       ✔️        |
| Enum                      | RadioGroup       |        Enum        |      ❌      |      ✔️      |       ✔️        |
| oneOf (const / title)     | Autocomplete     |     EnumOneOf      |      ❌      |      ✔️      |       ✔️        |
| oneOf (const / title)     | RadioGroup       |     EnumOneOf      |      ❌      |      ✔️      |       ✔️        |
| Array of objects          | Table            |     ArrayList      |      ❌      |      ✔️      |       ✔️        |
| Array of objects          | List with Detail |     ArrayList      |      ❌      |      ✔️      |       ✔️        |
| Array of enums            | Multiple Choice  |     ArrayList      |      ❌      |      ✔️      |       ✔️        |
| allOf                     | Tabs             |         -          |      ❌      |      ✔️      |       ✔️        |
| anyOf                     | Tabs             |         -          |      ❌      |      ✔️      |       ✔️        |
| Categorization            | Tabs             |         -          |      ❌      |      ✔️      |       ✔️        |
| Categorization Stepper    | Tabs             |         -          |      ❌      |      ✔️      |       ✔️        |
| const _type safety_       | Const            |        Enum        |      ⚠️      |      ❌       |       ✔️        |
| string (format: time)     | Time             |       Time         |      ⚠️      |    ️ ✔️      |       ✔️        |
| string (format: datetime) | DateTime         |      DateTime      |      ⚠️      |    ️ ✔️      |       ✔️        |

