import { Checkbox, CheckboxState, FormControl, Heading } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { printDimensionValue } from '../library/printDimensionValue';
import { Action, ActionType, VariableFontDimension } from '../reducer';
import { RangeInput } from './RangeInput';

interface FontDimensionRangeProps {
    dimension: VariableFontDimension;
    dispatch: Dispatch<Action>;
    id: string;
}

export const FontDimensionRange: FC<FontDimensionRangeProps> = ({ dimension, dispatch, id }) => {
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
                        max={dimension.editorMaxValue}
                        value={dimension.editorMinValue}
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
                        min={dimension.editorMinValue}
                        max={dimension.editorMaxValue}
                        value={dimension.editorDefault}
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
                        min={dimension.editorMinValue}
                        max={dimension.maxValue}
                        value={dimension.editorMaxValue}
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
                        min={dimension.minValue}
                        max={dimension.maxValue}
                        value={dimension.value}
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