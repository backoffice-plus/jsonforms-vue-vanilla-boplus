import { entry as passwordEntry } from './PasswordControlRenderer.vue';
import { entry as oneOfEntry } from './OneOfRenderer.vue';
import { entry as allOfEntry } from './AllOfRenderer.vue';
import { entry as anyOfEntry } from './AnyOfRenderer.vue';
import { entry as objectEntry } from './ObjectRenderer.vue';
import { entry as arrayLayoutEntry } from './ArrayLayoutRenderer.vue';
import { entry as arrayControlEntry } from './ArrayControlRenderer.vue';
import { entry as enumArrayEntry } from './EnumArrayRenderer.vue';
import { entry as sliderEntry } from './SliderControlRenderer.vue';
import { entry as toogleEntry } from './BooleanToggleControlRenderer.vue';
import { entry as categorizationEntry } from './CategorizationRenderer.vue';
import { entry as constEntry } from './ConstRenderer.vue';
import { entry as radioGroupEntry } from './RadioGroupControlRenderer.vue';
import { entry as autocompleteEntry } from './AutocompleteRenderer.vue';
import { entry as dateTimeEntry } from './DateTimeRenderer.vue';
import { entry as timeEntry } from './TimeRenderer.vue';

export default [
  passwordEntry,
  oneOfEntry,
  allOfEntry,
  anyOfEntry,
  objectEntry,
  arrayLayoutEntry,
  arrayControlEntry,
  enumArrayEntry,
  sliderEntry,
  toogleEntry,
  categorizationEntry,
  constEntry,
  radioGroupEntry,
  autocompleteEntry,
  dateTimeEntry,
  timeEntry,
];
