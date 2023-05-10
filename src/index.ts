// import EnumArrayRenderer from "./components/EnumArrayRenderer.vue";
// import BooleanToggleControlRenderer from "./components/BooleanToggleControlRenderer.vue";
// import RadioGroupControlRenderer from "./components/RadioGroupControlRenderer.vue";
// import AutocompleteRenderer from "./components/AutocompleteRenderer.vue";
// import {constEntry} from "./components/ConstRenderer.vue";
// import {
//     and,
//     or,
//     hasType,
//     rankWith,
//     schemaMatches,
//     schemaSubPathMatches,
//     isBooleanControl,
//     optionIs,
//     isEnumControl,
//     isOneOfEnumControl
// } from "@jsonforms/core";
// import type {JsonSchema} from "@jsonforms/core";
// import {uiTypeIs} from "@jsonforms/core/src/testers/testers";
//
//
// const hasOneOfItems = (schema: JsonSchema): boolean => (schema?.oneOf ?? [] as JsonSchema[]).every((entry: JsonSchema) => entry.const !== undefined);
// const hasEnumItems = (schema: JsonSchema): boolean => schema.type === 'string' && schema.enum !== undefined;
//
// export const enumArrayRendererEntry = {
//     renderer: EnumArrayRenderer,
//     tester: rankWith(5,
//         and(
//             uiTypeIs('Control'),
//             and(
//                 schemaMatches((schema) => hasType(schema, 'array') && !Array.isArray(schema.items) && schema.uniqueItems === true),
//                 schemaSubPathMatches('items', (schema) => hasOneOfItems(schema) || hasEnumItems(schema))
//             )
//         ))
// };
//
//
// export const booleanToggleControlRendererEntry = {
//     renderer: BooleanToggleControlRenderer,
//     tester: rankWith(3, and(isBooleanControl, optionIs('toggle', true))),
// };
//
// export const radioGroupControlRendererEntry = {
//     renderer: RadioGroupControlRenderer,
//     tester: rankWith(20, and(or(isEnumControl, isOneOfEnumControl), optionIs('format', 'radio'))),
// };
//
// export const boplusVueVanillaRenderers = [
//     enumArrayRendererEntry,
//     booleanToggleControlRendererEntry,
//     radioGroupControlRendererEntry,
//     constEntry
// ];
//
// //:TODO
// // boplusVueVanillaRenderers.push({
// //     renderer: ArrayLayoutRenderer,
// //     tester: rankWith(5, or(isObjectArrayWithNesting, and(uiTypeIs('ListWithDetail'), isObjectArray)))
// // });
//
// boplusVueVanillaRenderers.push({
//     renderer: AutocompleteRenderer,
//     tester: rankWith(10, and(or(isEnumControl, isOneOfEnumControl), optionIs('autocomplete', true)))
// });
//
//
import boplusVueVanillaRenderers from './vue3';
export default boplusVueVanillaRenderers;
