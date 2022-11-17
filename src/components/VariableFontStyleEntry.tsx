import { AppBridgeBlock } from '@frontify/app-bridge';
import {
    Button,
    ButtonStyle,
    Color,
    Flyout,
    FormControl,
    IconCross,
    IconMinusCircle,
    IconPen,
    TextInput,
    Textarea,
} from '@frontify/fondue';
import React, { ChangeEvent, Dispatch, FC } from 'react';
import usePromise from 'react-use-promise';

import { Action, ActionType, VariableFontStyle } from '../reducer';
import style from '../style.module.css';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
    variableFontName?: string;
}

export const VariableFontStyleEntry: FC<Props> = ({
    appBridge,
    dispatch,
    isEditing,
    variableFontStyle: { exampleText, id, hasFlyoutOpen, name, weight },
    variableFontName,
}) => {
    const [allColors /*, error, state*/] = usePromise(() => appBridge.getColors(), []);

    return (
        <div>
            <div className={style['example-text__wrapper']}>
                <p
                    className={style['example-text']}
                    style={{
                        fontFamily: variableFontName,
                        fontWeight: weight,
                    }}
                >
                    {exampleText}
                </p>
                <div className={style['style-info-container']}>
                    <div>
                        <h6 className={style['style-info__name']}>{name}</h6>
                        <p className={style['style-info__weight']}>
                            Weight: <strong>{weight}</strong>
                        </p>
                    </div>
                </div>
                {isEditing && (
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
                                <FormControl
                                    label={{
                                        children: `Font weight: ${weight}`,
                                        htmlFor: `style${id}fontWeight`,
                                    }}
                                >
                                    <input
                                        type="range"
                                        min="100"
                                        max="900"
                                        value={weight}
                                        onChange={(event) => {
                                            dispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    id,
                                                    partial: { weight: event.target.value },
                                                },
                                            });
                                        }}
                                    ></input>
                                </FormControl>
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
                )}
            </div>
        </div>
    );
};
