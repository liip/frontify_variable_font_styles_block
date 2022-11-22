import { Checkbox, CheckboxState, FormControl, Heading } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { getDimensionValue, printDimensionValue } from '../library/getDimensionValue';
import { Action, ActionType } from '../reducer';
import { VariableFontDimension } from '../VariableFontStylesBlock';
import { RangeInput } from './RangeInput';

interface FontDimensionRangeProps {
    dimension: VariableFontDimension;
    dispatch: Dispatch<Action>;
    id: string;
    isEditing: boolean;
}

export const FontDimensionRange: FC<FontDimensionRangeProps> = ({ dimension, dispatch, id, isEditing }) => {
    return (
        <div style={{ marginBottom: '4rem' }}>
            <Heading>{`${dimension.tag}: ${printDimensionValue(dimension)}`}</Heading>
            <FormControl
                label={{
                    children: 'Set a range for consumers',
                    htmlFor: `range${id}${dimension.tag}`,
                }}
            >
                <Checkbox
                    onChange={() => {
                        dispatch({
                            type: ActionType.EditDimensions,
                            payload: {
                                id,
                                tag: dimension.tag,
                                partial: {
                                    isValueRange: !dimension.isValueRange,
                                },
                            },
                        });
                    }}
                    label="Range"
                    state={dimension.isValueRange ? CheckboxState.Checked : CheckboxState.Unchecked}
                />
            </FormControl>
            {dimension.isValueRange ? (
                <>
                    <RangeInput
                        id={`${id}${dimension.tag}`}
                        label="Minimal value"
                        labelPrefixRange="minValueRange"
                        labelPrefixText="minValue"
                        min={dimension.minValue}
                        max={dimension.editorMaxValue || dimension.maxValue}
                        value={dimension.editorMinValue || getDimensionValue(dimension)}
                        onChange={(value) => {
                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: dimension.tag,
                                    partial: {
                                        editorMinValue: value,
                                    },
                                },
                            });
                        }}
                    />
                    <RangeInput
                        id={`${id}${dimension.tag}`}
                        label="Default value"
                        labelPrefixRange="defaultValueRange"
                        labelPrefixText="defaultValue"
                        min={dimension.editorMinValue || dimension.minValue}
                        max={dimension.editorMaxValue || dimension.maxValue}
                        value={dimension.editorDefault || getDimensionValue(dimension)}
                        onChange={(value) => {
                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: dimension.tag,
                                    partial: {
                                        editorDefault: value,
                                    },
                                },
                            });
                        }}
                    />
                    <RangeInput
                        id={`${id}${dimension.tag}`}
                        label="Maximum value"
                        labelPrefixRange="maxValueRange"
                        labelPrefixText="maxValue"
                        min={dimension.editorMinValue || dimension.minValue}
                        max={dimension.maxValue}
                        value={dimension.editorMaxValue || getDimensionValue(dimension)}
                        onChange={(value) => {
                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: dimension.tag,
                                    partial: {
                                        editorMaxValue: value,
                                    },
                                },
                            });
                        }}
                    />
                </>
            ) : (
                <>
                    <RangeInput
                        id={`${id}${dimension.tag}`}
                        label="Value"
                        labelPrefixRange="valueRange"
                        labelPrefixText="value"
                        min={isEditing ? dimension.minValue : dimension.editorMinValue}
                        max={isEditing ? dimension.maxValue : dimension.editorMaxValue}
                        value={getDimensionValue(dimension)}
                        onChange={(value) => {
                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: dimension.tag,
                                    partial: {
                                        value,
                                    },
                                },
                            });
                        }}
                    />
                </>
            )}
        </div>
    );
};
