import { Heading, Switch, SwitchSize } from '@frontify/fondue';
import React, { Dispatch, FC, useMemo } from 'react';
import { Handles, Rail, Slider, Tracks } from 'react-compound-slider';

import { Action, ActionType, VariableFontDimension } from '../../reducer';
import style from './RangeSetting.module.css';
import { Handle, SliderRail, Track } from '../RangeInput';
import { EditableTextWrapper } from '../EditableTextWrapper';
import { useThrottleCallback } from '@react-hook/throttle';
import debounce from 'lodash-es/debounce';

const MODE = 2;

const STEP = 1;

const sliderStyle = {
    position: 'relative',
    width: '100%',
    paddingTop: '0.75rem',
    paddingBottom: '0.75rem',
};

interface RangeSettingProps {
    dispatch: Dispatch<Action>;
    id: string;
    isEditing?: boolean;
    localDimension: VariableFontDimension;
    setLocalDimension: (dimension: VariableFontDimension) => void;
    tag: string;
}

const THROTTLE_FPS = 30;

const DEBOUNCE_MS = 1500;

export const RangeSetting: FC<RangeSettingProps> = ({
    dispatch,
    id,
    isEditing,
    localDimension,
    setLocalDimension,
    tag,
}) => {
    const debouncedEdit = useMemo(
        () =>
            debounce((partial: Partial<VariableFontDimension>) => {
                dispatch({
                    type: ActionType.EditDimensions,
                    payload: {
                        id,
                        partial,
                        tag,
                    },
                });
            }, DEBOUNCE_MS),
        [tag, dispatch, id]
    );

    const localEdit = useThrottleCallback((partial: Partial<VariableFontDimension>) => {
        setLocalDimension({ ...localDimension, ...partial });
    }, THROTTLE_FPS);

    const handleRegularEdit = (values: readonly number[]) => {
        const partial = { value: values[0] };
        localEdit(partial);
        debouncedEdit(partial);
    };

    const handleRangeEdit = (values: readonly number[]) => {
        const partial = {
            editorMinValue: values[0],
            editorDefault: values[1],
            value: values[1],
            editorMaxValue: values[MODE],
        };
        localEdit(partial);
        debouncedEdit(partial);
    };

    return (
        <div className={style['range-setting']}>
            <div className={style['range-setting__title']}>
                <Heading size="large" weight="strong">
                    {localDimension.tag}
                </Heading>
                {isEditing && (
                    <Switch
                        hug
                        label="Set range"
                        name={`isRange${id}${localDimension.tag}`}
                        on={!!localDimension.isValueRange}
                        onChange={() => {
                            const partial: Partial<VariableFontDimension> = {
                                isValueRange: !localDimension.isValueRange,
                            };

                            if (localDimension.isValueRange) {
                                // If we are currently in a range, we set the value to the default value from the range
                                partial.value = localDimension.editorDefault;
                            } else {
                                // If we are currently not in a range, we set the range default to the value and make sure we don't violate min and max values
                                partial.editorDefault = localDimension.value;
                                if (localDimension.value < localDimension.editorMinValue) {
                                    partial.editorMinValue = localDimension.value;
                                }
                                if (localDimension.value > localDimension.editorMaxValue) {
                                    partial.editorMaxValue = localDimension.value;
                                }
                            }

                            dispatch({
                                type: ActionType.EditDimensions,
                                payload: {
                                    id,
                                    tag: localDimension.tag,
                                    partial,
                                },
                            });
                        }}
                        size={SwitchSize.Small}
                    />
                )}
            </div>
            <div className={style['range-setting__value-bar']}>
                {(isEditing || localDimension.isValueRange) && (
                    <div className={style['range-setting__value-field']}>
                        <span>Min</span>
                        <EditableTextWrapper
                            isEditing={isEditing && localDimension.isValueRange}
                            onEditableSave={(value) => {
                                const valueAsNumber = parseInt(value) || 0;
                                const partial: Partial<VariableFontDimension> = {
                                    editorMinValue: valueAsNumber,
                                };
                                // If value and defaultValue are smaller than min value they need to be updated here too
                                if (localDimension.value < valueAsNumber) {
                                    partial.value = valueAsNumber + STEP;
                                }
                                if (localDimension.defaultValue < valueAsNumber) {
                                    partial.defaultValue = valueAsNumber + STEP;
                                }

                                dispatch({
                                    type: ActionType.EditDimensions,
                                    payload: {
                                        id,
                                        tag: localDimension.tag,
                                        partial,
                                    },
                                });
                            }}
                        >
                            <strong>{localDimension.editorMinValue.toString()}</strong>
                        </EditableTextWrapper>
                    </div>
                )}
                {localDimension.isValueRange && isEditing && (
                    <div className={`${style['range-setting__value-field']} tw-text-center`}>
                        <span>Default</span>
                        <EditableTextWrapper
                            isEditing={isEditing && localDimension.isValueRange}
                            onEditableSave={(value) => {
                                dispatch({
                                    type: ActionType.EditDimensions,
                                    payload: {
                                        id,
                                        tag: localDimension.tag,
                                        partial: {
                                            editorDefault: parseInt(value),
                                            value: parseInt(value),
                                        },
                                    },
                                });
                            }}
                        >
                            <strong className="tw-text-center">{localDimension.editorDefault.toString()}</strong>
                        </EditableTextWrapper>
                    </div>
                )}
                {(!localDimension.isValueRange || !isEditing) && (
                    <div
                        className={`${style['range-setting__value-field']}${
                            isEditing || localDimension.isValueRange ? ' tw-text-center' : ''
                        }`}
                    >
                        <span>Value</span>
                        <EditableTextWrapper
                            isEditing={isEditing}
                            onEditableSave={(value) => {
                                dispatch({
                                    type: ActionType.EditDimensions,
                                    payload: {
                                        id,
                                        tag: localDimension.tag,
                                        partial: {
                                            value: parseInt(value),
                                        },
                                    },
                                });
                            }}
                        >
                            <strong className="tw-text-center">{localDimension.value.toString()}</strong>
                        </EditableTextWrapper>
                    </div>
                )}
                {(isEditing || localDimension.isValueRange) && (
                    <div className={`${style['range-setting__value-field']} tw-text-right`}>
                        <span>Max</span>
                        <EditableTextWrapper
                            isEditing={isEditing && localDimension.isValueRange}
                            onEditableSave={(value) => {
                                const valueAsNumber = parseInt(value) || 0;
                                const partial: Partial<VariableFontDimension> = {
                                    editorMaxValue: valueAsNumber,
                                };
                                // If value and defaultValue are larger than max value they need to be updated here too
                                if (localDimension.value < valueAsNumber) {
                                    partial.value = valueAsNumber - STEP;
                                }
                                if (localDimension.defaultValue < valueAsNumber) {
                                    partial.defaultValue = valueAsNumber - STEP;
                                }
                                dispatch({
                                    type: ActionType.EditDimensions,
                                    payload: {
                                        id,
                                        tag: localDimension.tag,
                                        partial,
                                    },
                                });
                            }}
                        >
                            <strong className="tw-text-right">{localDimension.editorMaxValue.toString()}</strong>
                        </EditableTextWrapper>
                    </div>
                )}
            </div>
            {isEditing && localDimension.isValueRange && (
                <Slider
                    mode={MODE}
                    step={STEP}
                    domain={[localDimension.minValue, localDimension.maxValue]}
                    rootStyle={sliderStyle}
                    onUpdate={handleRangeEdit}
                    values={[
                        localDimension.editorMinValue,
                        localDimension.editorDefault,
                        localDimension.editorMaxValue,
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
                                        domain={[localDimension.minValue, localDimension.maxValue]}
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
            {isEditing && !localDimension.isValueRange && (
                <Slider
                    mode={MODE}
                    step={STEP}
                    domain={[localDimension.editorMinValue, localDimension.editorMaxValue]}
                    rootStyle={sliderStyle}
                    onUpdate={handleRegularEdit}
                    values={[localDimension.value || 0]}
                >
                    <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map((handle) => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={[localDimension.minValue, localDimension.maxValue]}
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
            {!isEditing && localDimension.isValueRange && (
                <Slider
                    mode={MODE}
                    step={STEP}
                    domain={[localDimension.editorMinValue, localDimension.editorMaxValue]}
                    rootStyle={sliderStyle}
                    onUpdate={handleRegularEdit}
                    values={[localDimension.value || 0]}
                >
                    <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
                    <Handles>
                        {({ handles, getHandleProps }) => (
                            <div className="slider-handles">
                                {handles.map((handle) => (
                                    <Handle
                                        key={handle.id}
                                        handle={handle}
                                        domain={[localDimension.editorMinValue, localDimension.editorMaxValue]}
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
