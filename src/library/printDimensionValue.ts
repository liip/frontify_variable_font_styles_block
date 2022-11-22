import { VariableFontDimension } from '../reducer';

export const printDimensionValue = (dimension: VariableFontDimension) => {
    return dimension.isValueRange
        ? `${dimension.editorMinValue} - ${dimension.editorDefault} - ${dimension.editorMaxValue}`
        : dimension.value;
};
