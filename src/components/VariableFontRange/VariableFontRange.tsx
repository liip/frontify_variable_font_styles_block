import { Heading, Switch, SwitchSize } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider';

import { Action, ActionType, VariableFontDimension } from '../../reducer';
import style from './VariableFontRange.module.css';
import { Handle, SliderRail, Track } from '../Range';
import { VariableFontEditable } from '../VariableFontEditable';

const sliderStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
};

interface VariableFontRangeProps {
    dimension: VariableFontDimension;
    dispatch: Dispatch<Action>;
    id: string;
    isEditing?: boolean;
}

export const VariableFontRange: FC<VariableFontRangeProps> = ({ dimension, dispatch, id, isEditing }) => {
    return (
        <div className={style['variable-font-range']}>
            <div className={style['variable-font-range__title']}>
                <Heading size="large" weight="strong">
                    {dimension.tag}
                </Heading>
                {isEditing && (
                    <Switch
                        hug
                        label="Set range"
                        name={`isRange${id}${dimension.tag}`}
                        on={!!dimension.isValueRange}
                        onChange={() => {
                            const partial: Partial<VariableFontDimension> = {
                                isValueRange: !dimension.isValueRange,
                            };

                            if (dimension.isValueRange) {
                                // If we are currently in a range, we set the value to the default value from the range
                                partial.value = dimension.editorDefault;
                            } else {
                                // If we are currently not in a range, we set the range default to the value and make sure we don't violate min and max values
                                partial.editorDefault = dimension.value;
                                if (dimension.value < dimension.editorMinValue) {
                                    partial.editorMinValue = dimension.value;
                                }
                                if (dimension.value > dimension.editorMaxValue) {
                                    partial.editorMaxValue = dimension.value;
                                }
                            }

                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: dimension.tag,
                                    partial,
                                },
                            });
                        }}
                        size={SwitchSize.Small}
                    />
                )}
            </div>
            <div className={style['variable-font-range__value-bar']}>
                {(isEditing || dimension.isValueRange) && (
                    <div className={style['variable-font-range__value-field']}>
                        <span>Min</span>
                        <VariableFontEditable
                            isEditing={isEditing && dimension.isValueRange}
                            onEditableSave={(value) => {
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
                        >
                            <strong>{dimension.editorMinValue}</strong>
                        </VariableFontEditable>
                    </div>
                )}
                {dimension.isValueRange && isEditing && (
                    <div className={`${style['variable-font-range__value-field']} tw-text-center`}>
                        <span>Default</span>
                        <VariableFontEditable
                            isEditing={isEditing && dimension.isValueRange}
                            onEditableSave={(value) => {
                                dispatch({
                                    type: ActionType.EditDimensions,
                                    payload: {
                                        id,
                                        tag: dimension.tag,
                                        partial: {
                                            editorDefault: value,
                                            value,
                                        },
                                    },
                                });
                            }}
                        >
                            <strong className="tw-text-center">{dimension.editorDefault}</strong>
                        </VariableFontEditable>
                    </div>
                )}
                {(!dimension.isValueRange || !isEditing) && (
                    <div
                        className={`${style['variable-font-range__value-field']}${
                            isEditing || dimension.isValueRange ? ' tw-text-center' : ''
                        }`}
                    >
                        <span>Value</span>
                        <VariableFontEditable
                            isEditing={isEditing}
                            onEditableSave={(value) => {
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
                        >
                            <strong className="tw-text-center">{dimension.value}</strong>
                        </VariableFontEditable>
                    </div>
                )}
                {(isEditing || dimension.isValueRange) && (
                    <div className={`${style['variable-font-range__value-field']} tw-text-right`}>
                        <span>Max</span>
                        <VariableFontEditable
                            isEditing={isEditing && dimension.isValueRange}
                            onEditableSave={(value) => {
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
                        >
                            <strong className="tw-text-right">{dimension.editorMaxValue.toString()}</strong>
                        </VariableFontEditable>
                    </div>
                )}
            </div>
            {isEditing && dimension.isValueRange && (
                <Slider
                    mode={2}
                    step={1}
                    domain={[parseInt(dimension.minValue), parseInt(dimension.maxValue)]}
                    rootStyle={sliderStyle}
                    onUpdate={(values) => {
                        console.log(values);
                        dispatch({
                            type: ActionType.EditDimensions,
                            payload: {
                                id,
                                tag: dimension.tag,
                                partial: {
                                    editorMinValue: `${values[0]}`,
                                    editorDefault: `${values[1]}`,
                                    value: `${values[1]}`,
                                    editorMaxValue: `${values[2]}`,
                                },
                            },
                        });
                    }}
                    values={[
                        parseInt(dimension.editorMinValue),
                        parseInt(dimension.editorDefault),
                        parseInt(dimension.editorMaxValue),
                    ]}
                >
                    <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map((handle) => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={
                                            isEditing
                                                ? [parseInt(dimension.minValue), parseInt(dimension.maxValue)]
                                                : [
                                                      parseInt(dimension.editorMinValue),
                                                      parseInt(dimension.editorMaxValue),
                                                  ]
                                        }
                                        getHandleProps={getHandleProps}
                                    />
                                ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks left={false} right={false}>
                        {({ tracks, getTrackProps }) => (
                            <div className="slider-tracks">
                                {tracks.map(({ id, source, target }) => (
                                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                                ))}
                            </div>
                        )}
                    </Tracks>
                </Slider>
            )}
            {isEditing && !dimension.isValueRange && (
                <Slider
                    mode={2}
                    step={1}
                    domain={[parseInt(dimension.editorMinValue), parseInt(dimension.editorMaxValue)]}
                    rootStyle={sliderStyle}
                    onUpdate={(values) => {
                        console.log(values);
                        dispatch({
                            type: ActionType.EditDimensions,
                            payload: {
                                id,
                                tag: dimension.tag,
                                partial: { value: `${values[0]}` },
                            },
                        });
                    }}
                    values={[parseInt(dimension.value || '0')]}
                >
                    <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map((handle) => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={
                                            isEditing
                                                ? [parseInt(dimension.minValue), parseInt(dimension.maxValue)]
                                                : [
                                                      parseInt(dimension.editorMinValue),
                                                      parseInt(dimension.editorMaxValue),
                                                  ]
                                        }
                                        getHandleProps={getHandleProps}
                                    />
                                ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks left={false} right={false}>
                        {({ tracks, getTrackProps }) => (
                            <div className="slider-tracks">
                                {tracks.map(({ id, source, target }) => (
                                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                                ))}
                            </div>
                        )}
                    </Tracks>
                </Slider>
            )}
            {!isEditing && dimension.isValueRange && (
                <Slider
                    mode={2}
                    step={1}
                    domain={[parseInt(dimension.editorMinValue), parseInt(dimension.editorMaxValue)]}
                    rootStyle={sliderStyle}
                    onUpdate={(values) => {
                        console.log(values);
                        dispatch({
                            type: ActionType.EditDimensions,
                            payload: {
                                id,
                                tag: dimension.tag,
                                partial: { value: `${values[0]}` },
                            },
                        });
                    }}
                    values={[parseInt(dimension.value || '0')]}
                >
                    <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map((handle) => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={
                                            isEditing
                                                ? [parseInt(dimension.minValue), parseInt(dimension.maxValue)]
                                                : [
                                                      parseInt(dimension.editorMinValue),
                                                      parseInt(dimension.editorMaxValue),
                                                  ]
                                        }
                                        getHandleProps={getHandleProps}
                                    />
                                ))}
                            </div>
                        )}
                    </Handles>
                    <Tracks left={false} right={false}>
                        {({ tracks, getTrackProps }) => (
                            <div className="slider-tracks">
                                {tracks.map(({ id, source, target }) => (
                                    <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                                ))}
                            </div>
                        )}
                    </Tracks>
                </Slider>
            )}
        </div>
    );
};
