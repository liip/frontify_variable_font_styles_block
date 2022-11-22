import { AppBridgeBlock } from '@frontify/app-bridge';
import {
    Button,
    ButtonStyle,
    Color,
    Flyout,
    FormControl,
    IconMinusCircle,
    IconPen,
    TextInput,
    Textarea,
} from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { getDimensionValue, printDimensionValue } from '../library/getDimensionValue';
import { Action, ActionType, VariableFontStyle } from '../reducer';
import style from '../style.module.css';
import { VariableFontDimension } from '../VariableFontStylesBlock';
import { FontDimensionRange } from './FontDimensionRange';
import { RangeInput } from './RangeInput';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
    variableFontName?: string;
    variableFontDimensions: VariableFontDimension[];
}

const EXCLUDED_DIMENSIONS = ['wdth', 'wght'];

const getVariationSetting = (dimensions: Record<string, VariableFontDimension>) =>
    Object.values(dimensions)
        .filter((dimension) => !EXCLUDED_DIMENSIONS.includes(dimension.tag))
        .map((dimension) => `"${dimension.tag}" ${getDimensionValue(dimension)}`)
        .join(', ');

export const VariableFontStyleEntry: FC<Props> = ({
    dispatch,
    isEditing,
    variableFontStyle: { dimensions, fontDescription, exampleText, id, hasFlyoutOpen, name },
    variableFontName,
}) => {
    return (
        <div>
            <div className={style['example-text__wrapper']}>
                <p
                    className={style['example-text']}
                    style={{
                        fontFamily: variableFontName,
                        fontWeight: dimensions?.wght ? getDimensionValue(dimensions.wght) : undefined,
                        fontStretch: dimensions?.wdth ? `${getDimensionValue(dimensions.wdth)}%` : undefined,
                        fontVariationSettings: getVariationSetting(dimensions),
                    }}
                >
                    {exampleText}
                </p>
                <div className={style['style-info-container']}>
                    <div>
                        <h6 className={style['style-info__name']}>{name}</h6>
                        <p className={style['style-info__weight']}>
                            Description: <strong>{fontDescription}</strong>
                        </p>
                        {Object.values(dimensions).map((dimension) => (
                            <div key={dimension.tag}>
                                <p className={style['style-info__weight']}>
                                    {dimension.tag}: <strong>{printDimensionValue(dimension)}</strong>
                                </p>
                                {dimension.isValueRange &&
                                    dimension.editorDefault &&
                                    dimension.editorMinValue &&
                                    dimension.editorMaxValue && (
                                        <RangeInput
                                            id={`${id}${dimension.tag}`}
                                            label="Set preferred range"
                                            labelPrefixRange="preferredRange"
                                            labelPrefixText="preferredText"
                                            min={dimension.editorMinValue}
                                            max={dimension.editorMaxValue}
                                            value={dimension.value || dimension.editorDefault}
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
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={style['example-text__edit-wrapper']}>
                    <Flyout
                        isOpen={hasFlyoutOpen}
                        trigger={
                            <Button
                                icon={<IconPen />}
                                onClick={() =>
                                    dispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            id,
                                            partial: { hasFlyoutOpen: !hasFlyoutOpen },
                                        },
                                    })
                                }
                                style={ButtonStyle.Secondary}
                            ></Button>
                        }
                        onOpenChange={(isOpen) =>
                            dispatch({
                                type: ActionType.Edit,
                                payload: {
                                    id,
                                    partial: { hasFlyoutOpen: isOpen },
                                },
                            })
                        }
                        onCancel={() =>
                            dispatch({
                                type: ActionType.Edit,
                                payload: {
                                    id,
                                    partial: { hasFlyoutOpen: false },
                                },
                            })
                        }
                    >
                        <div className={style['overlay-container']}>
                            {isEditing && (
                                <>
                                    <FormControl
                                        label={{
                                            children: 'Style name',
                                            htmlFor: `style${id}styleName`,
                                        }}
                                    >
                                        <TextInput
                                            value={name}
                                            onChange={(value) =>
                                                dispatch({
                                                    type: ActionType.Edit,
                                                    payload: {
                                                        id,
                                                        partial: { name: value },
                                                    },
                                                })
                                            }
                                        ></TextInput>
                                    </FormControl>
                                    <FormControl
                                        label={{
                                            children: 'Font description',
                                            htmlFor: `style${id}description`,
                                        }}
                                    >
                                        <Textarea
                                            value={fontDescription}
                                            onInput={(value) =>
                                                dispatch({
                                                    type: ActionType.Edit,
                                                    payload: {
                                                        id,
                                                        partial: { fontDescription: value },
                                                    },
                                                })
                                            }
                                        />
                                    </FormControl>
                                    <FormControl
                                        label={{
                                            children: 'Style example text',
                                            htmlFor: `style${id}exampleText`,
                                        }}
                                    >
                                        <Textarea
                                            value={exampleText}
                                            onInput={(value) =>
                                                dispatch({
                                                    type: ActionType.Edit,
                                                    payload: {
                                                        id,
                                                        partial: { exampleText: value },
                                                    },
                                                })
                                            }
                                        />
                                    </FormControl>
                                </>
                            )}
                            {Object.values(dimensions).map((dimension) => (
                                <FontDimensionRange key={dimension.tag} {...{ dimension, dispatch, isEditing, id }} />
                            ))}
                        </div>
                    </Flyout>
                    <Button
                        hugWidth
                        icon={<IconMinusCircle />}
                        style={ButtonStyle.Secondary}
                        onClick={() =>
                            dispatch({
                                type: ActionType.Delete,
                                payload: {
                                    id,
                                },
                            })
                        }
                    />
                </div>
            </div>
        </div>
    );
};
