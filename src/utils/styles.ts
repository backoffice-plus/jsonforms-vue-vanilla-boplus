export const bopStyles: BopStyles = {
  categorization: {
    root: 'categorization',
    category: 'tabs',
    selected: 'selected',
    panel: 'panel',
  },
  allOf: {
    root: 'allof',
  },
  oneOf: {
    root: 'oneof',
    select: 'oneof-select',
  },
  anyOf: {
    root: 'categorization',
    category: 'tabs',
    selected: 'selected',
    panel: 'panel',
  },
  objectAddProps: {
    root: 'object-addprops-root',
    /** @deprecated **/
    toolbar: 'object-addprops-toolbar',
    button: 'object-addprops-button',
    items: 'object-addprops-items',
    item: 'object-addprops-item',
    itemDeleteButton: 'object-addprops-item-delete-button',
  },
  enumArray: {
    root: 'enum-array',
    item: 'enum-array-item',
  },
  toggle: {
    root: 'toggle',
    slider: 'slider',
  },
  controlWithTypes: {
    root: 'control-with-types'
  },
};
export const defaultStyles = bopStyles;

export interface BopStyles {
  categorization: {
    root?: string;
    category?: string;
    selected?: string;
    panel?: string;
  };
  oneOf: {
    root?: string;
    select?: string;
  };
  allOf: {
    root?: string;
  };
  anyOf: {
    root?: string;
    category?: string;
    selected?: string;
    panel?: string;
  };
  objectAddProps: {
    root?: string;
    /** @deprecated **/
    toolbar?: string;
    button?: string;
    items?: string;
    item?: string;
    itemDeleteButton?: string;
  };
  enumArray: {
    root?: string;
    item?: string;
    label?: string;
  };
  toggle: {
    root?: string;
    slider?: string;
  };
  controlWithTypes: {
    root?: string;
  };
}
