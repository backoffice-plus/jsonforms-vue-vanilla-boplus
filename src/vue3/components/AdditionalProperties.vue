<template>
  <div v-if="control.visible" :class="styles.objectAddProps.root">
    <header :class="styles.objectAddProps.toolbar">
      <label>{{ additionalPropertiesTitle }}</label>

      <div>
        <input
          v-model="newPropertyName"
          :required="true"
          type="text"
          :placeholder="placeholder"
          :disabled="!control.enabled"
        />
        <div v-if="newPropertyErrors.length" :class="styles.control.error">
          {{ newPropertyErrors ? newPropertyErrors : null }}
        </div>
      </div>

      <div>
        <button
          :disabled="addPropertyDisabled"
          @click="addProperty"
          v-text="'+'"
        />
      </div>
    </header>

    <section :class="styles.objectAddProps.items">
      <div
        v-for="(element, index) in additionalPropertyItems"
        :key="`${index}`"
      >
        <dispatch-renderer
          v-if="element.schema && element.uischema"
          :schema="element.schema"
          :uischema="element.uischema"
          :path="element.path"
          :enabled="control.enabled"
          :renderers="control.renderers"
          :cells="control.cells"
        />

        <button
          v-if="control.enabled"
          :disabled="removePropertyDisabled"
          @click="removeProperty(element.propertyName)"
          v-text="'x'"
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import {
  composePaths,
  createControlElement,
  createDefaultValue,
  encode,
  Generate,
  getI18nKey,
  validate,
} from '@jsonforms/core';

import type {
  GroupLayout,
  JsonSchema,
  JsonSchema7,
  UISchemaElement,
} from '@jsonforms/core';

import {
  DispatchRenderer,
  useJsonFormsControlWithDetail,
} from '@jsonforms/vue';
import type Ajv from 'ajv';
import type { ValidateFunction } from 'ajv';
import get from 'lodash/get';
import isPlainObject from 'lodash/isPlainObject';
import startCase from 'lodash/startCase';
import { defineComponent, ref } from 'vue';
import type { PropType, Ref } from 'vue';
import { useStyles } from '@jsonforms/vue-vanilla';
import {
  defaultStyles,
  useAjv,
  useControlAppliedOptions,
  useTranslator,
} from '../utils';
import merge from 'lodash/merge';

/**
 * https://github.com/eclipsesource/jsonforms-vuetify-renderers/blob/main/vue2-vuetify/src/complex/components/AdditionalProperties.vue
 */

type Input = ReturnType<typeof useJsonFormsControlWithDetail>;
interface AdditionalPropertyType {
  propertyName: string;
  path: string;
  schema: JsonSchema | undefined;
  uischema: UISchemaElement | undefined;
}

const reuseAjvForSchema = (ajv: Ajv, schema: JsonSchema): Ajv => {
  if (
    Object.prototype.hasOwnProperty.call(schema, 'id') ||
    Object.prototype.hasOwnProperty.call(schema, '$id')
  ) {
    ajv.removeSchema(schema);
  }
  return ajv;
};

export default defineComponent({
  name: 'AdditionalProperties',
  components: {
    DispatchRenderer,
  },
  props: {
    input: {
      type: Object as PropType<Input>,
      required: true,
    },
  },
  setup(props) {
    const control = props.input.control;
    const reservedPropertyNames = Object.keys(
      control.value.schema.properties || {}
    );

    const additionalKeys = Object.keys(control.value?.data ?? {}).filter(
      (k) => !reservedPropertyNames.includes(k)
    );

    const toAdditionalPropertyType = (
      propName: string,
      propValue: any
    ): AdditionalPropertyType => {
      let propSchema: JsonSchema | undefined = undefined;
      let propUiSchema: UISchemaElement | undefined = undefined;

      if (control.value.schema.patternProperties) {
        const matchedPattern = Object.keys(
          control.value.schema.patternProperties
        ).find((pattern) => new RegExp(pattern).test(propName));
        if (matchedPattern) {
          propSchema = control.value.schema.patternProperties[matchedPattern];
        }
      }

      if (
        !propSchema &&
        typeof control.value.schema.additionalProperties === 'object'
      ) {
        propSchema = control.value.schema.additionalProperties;
      }

      if (!propSchema && propValue !== undefined) {
        // can't find the propertySchema so use the schema based on the value
        // this covers case where the data in invalid according to the schema
        propSchema = Generate.jsonSchema(
          { prop: propValue },
          {
            additionalProperties: false,
            required: () => false,
          }
        ).properties?.prop;
      }

      if (propSchema) {
        if (propSchema.type === 'object' || propSchema.type === 'array') {
          propUiSchema = Generate.uiSchema(propSchema, 'Group');
          (propUiSchema as GroupLayout).label =
            propSchema.title ?? startCase(propName);
        } else {
          propUiSchema = createControlElement(
            control.value.path + '/' + encode(propName)
          );
        }
      }

      return {
        propertyName: propName,
        path: composePaths(control.value.path, propName),
        schema: propSchema,
        uischema: propUiSchema,
      };
    };

    const appliedOptions = useControlAppliedOptions(props.input);
    const additionalPropertyItems = ref<AdditionalPropertyType[]>([]);

    additionalKeys.forEach((propName) => {
      const additionalProperty = toAdditionalPropertyType(
        propName,
        control.value.data[propName]
      );
      additionalPropertyItems.value.push(additionalProperty);
    });

    const styles = merge(useStyles(control.value.uischema), defaultStyles);
    const newPropertyName = ref<string | null>('');
    const ajv = useAjv();

    let propertyNameSchema: JsonSchema7 | undefined = undefined;
    let propertyNameValidator: ValidateFunction<unknown> | undefined =
      undefined;

    // TODO: create issue against jsonforms to add propertyNames into the JsonSchema interface
    // propertyNames exist in draft-6 but not defined in the JsonSchema
    if (typeof (control.value.schema as any).propertyNames === 'object') {
      propertyNameSchema = (control.value.schema as any).propertyNames;
    }

    if (
      typeof control.value.schema.additionalProperties !== 'object' &&
      typeof control.value.schema.patternProperties === 'object'
    ) {
      const matchPatternPropertiesKeys: JsonSchema7 = {
        type: 'string',
        pattern: Object.keys(control.value.schema.patternProperties).join('|'),
      };

      propertyNameSchema = propertyNameSchema
        ? { allOf: [propertyNameSchema, matchPatternPropertiesKeys] }
        : matchPatternPropertiesKeys;
    }

    if (propertyNameSchema) {
      propertyNameValidator = reuseAjvForSchema(
        ajv,
        propertyNameSchema
      ).compile(propertyNameSchema);
    }

    const vuetifyProps = (path: string) => {
      const props = get(appliedOptions.value?.vuetify, path);

      return props && isPlainObject(props) ? props : {};
    };

    const t = useTranslator();
    return {
      t,
      vuetifyProps,
      ajv,
      propertyNameValidator,
      control,
      styles,
      appliedOptions,
      additionalPropertyItems,
      toAdditionalPropertyType,
      newPropertyName,
    };
  },
  computed: {
    addPropertyDisabled(): boolean {
      return (
        // add is disabled because the overall control is disabled
        !this.control.enabled ||
        // add is disabled because of contraints
        (this.appliedOptions.restrict && this.maxPropertiesReached) ||
        // add is disabled because there are errors for the new property name or it is not specified
        this.newPropertyErrors.length > 0 ||
        !this.newPropertyName
      );
    },
    maxPropertiesReached(): boolean {
      return (
        this.control.schema.maxProperties !== undefined && // we have maxProperties constraint
        this.control.data && // we have data to check
        // the current number of properties in the object is greater or equals to the maxProperties
        Object.keys(this.control.data).length >=
          this.control.schema.maxProperties
      );
    },
    removePropertyDisabled(): boolean {
      return (
        // add is disabled because the overall control is disabled
        !this.control.enabled ||
        // add is disabled because of contraints
        (this.appliedOptions.restrict && this.minPropertiesReached)
      );
    },
    minPropertiesReached(): boolean {
      return (
        this.control.schema.minProperties !== undefined && // we have minProperties constraint
        this.control.data && // we have data to check
        // the current number of properties in the object is less or equals to the minProperties
        Object.keys(this.control.data).length <=
          this.control.schema.minProperties
      );
    },
    newPropertyErrors(): string[] {
      if (this.newPropertyName) {
        const messages = this.propertyNameValidator
          ? (validate(this.propertyNameValidator, this.newPropertyName)
              .map((error) => error.message)
              .filter((message) => message) as string[])
          : [];
        if (
          this.reservedPropertyNames.includes(this.newPropertyName) ||
          this.additionalPropertyItems.find(
            (ap: any) => ap.propertyName === this.newPropertyName
          ) !== undefined
        ) {
          // already defined
          messages.push(
            `Property '${this.newPropertyName}' is already defined`
          );
        }

        // JSONForms has special means for "[]." chars - those are part of the path composition so for not we can't support those without special handling
        if (this.newPropertyName.includes('[')) {
          messages.push('Property name contains invalid char: [');
        }
        if (this.newPropertyName.includes(']')) {
          messages.push('Property name contains invalid char: ]');
        }
        if (this.newPropertyName.includes('.')) {
          messages.push('Property name contains invalid char: .');
        }

        return messages;
      }

      return [];
    },
    placeholder(): string {
      return this.t(this.i18nKey('newProperty.placeholder'), 'New Property');
    },
    reservedPropertyNames(): string[] {
      return Object.keys(this.control.schema.properties || {});
    },
    additionalPropertiesTitle(): string | undefined {
      const additionalProperties = this.control.schema.additionalProperties;

      const label =
        typeof additionalProperties === 'object' &&
        Object.prototype.hasOwnProperty.call(additionalProperties, 'title')
          ? additionalProperties.title ?? 'Additional Properties'
          : 'Additional Properties';

      return this.t(this.i18nKey('title'), label);
    },
    addToLabel(): string {
      return this.t(
        this.i18nKey('btn.add'),
        'Add to ${additionalProperties.title}',
        {
          additionalProperties: {
            title: this.additionalPropertiesTitle,
          },
        }
      );
    },
    deleteLabel(): string {
      return this.t(
        this.i18nKey('btn.delete'),
        'Delete from ${additionalProperties.title}',
        {
          additionalProperties: {
            title: this.additionalPropertiesTitle,
          },
        }
      );
    },
  },
  watch: {
    'control.data': {
      handler(newData) {
        // revert back any undefined values back to the default value when the key is part of the addtional properties since we want to preserved the key
        // for example when we have a string additonal property then when we clear the text component the componet by default sets the value to undefined to remove the property from the object - for additional properties we do not want that behaviour
        if (typeof this.control.data === 'object') {
          const keys = Object.keys(newData);
          let hasChanges = false;
          this.additionalPropertyItems.forEach((ap: any) => {
            if (
              ap.schema &&
              (!keys.includes(ap.propertyName) ||
                newData[ap.propertyName] === undefined ||
                (newData[ap.propertyName] === null &&
                  ap.schema.type !== 'null')) // createDefaultValue will return null only when the ap.schema.type is 'null'
            ) {
              const newValue = createDefaultValue(ap.schema);
              hasChanges = newData[ap.propertyName] !== newValue;
              newData[ap.propertyName] = newValue;
            }
          });
          if (hasChanges) {
            this.input.handleChange(this.control.path, newData);
          }
        }
      },
      deep: true,
    },
  },
  methods: {
    composePaths,
    i18nKey(key: string): string {
      return getI18nKey(
        this.control.schema,
        this.control.uischema,
        this.control.path,
        `additionalProperties.${key}`
      );
    },
    addProperty() {
      if (this.newPropertyName) {
        const additionalProperty = this.toAdditionalPropertyType(
          this.newPropertyName,
          undefined
        );
        if (additionalProperty) {
          this.additionalPropertyItems = [
            ...this.additionalPropertyItems,
            additionalProperty,
          ];
        }

        if (
          typeof this.control.data === 'object' &&
          additionalProperty.schema
        ) {
          this.control.data[this.newPropertyName] = createDefaultValue(
            additionalProperty.schema
          );
          // we need always to preserve the key even when the value is "empty"
          this.input.handleChange(this.control.path, this.control.data);
        }
      }
      this.newPropertyName = '';
    },
    removeProperty(propName: string): void {
      this.additionalPropertyItems = this.additionalPropertyItems.filter(
        (d: any) => d.propertyName !== propName
      );
      if (typeof this.control.data === 'object') {
        delete this.control.data[propName];
        this.input.handleChange(this.control.path, this.control.data);
      }
    },
  },
});
</script>
