export const defaultStyles: BopStyles = {
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
    toolbar: 'object-addprops-toolbar',
    items: 'object-addprops-items',
  },
  enumArray: {
    root: 'enum-array',
    item: 'enum-array-item',
  },
  toggle: {
    root: 'toggle',
    slider: 'slider',
  },
};

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
    toolbar?: string;
    items?: string;
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
}
