import { VariableFontDimension } from '../VariableFontStylesBlock';

export const getDimensionValue = (dimension: VariableFontDimension) =>
    dimension.value || dimension.editorDefault || dimension.defaultValue;

export const printDimensionValue = (dimension: VariableFontDimension) => {
    return dimension.isValueRange
        ? `${dimension.editorMinValue} - ${dimension.editorDefault} - ${dimension.editorMaxValue}`
        : dimension.value || dimension.defaultValue;
};
