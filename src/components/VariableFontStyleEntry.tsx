import { AppBridgeBlock } from '@frontify/app-bridge';
import { Button, ButtonStyle, Color, IconMinusCircle, IconPen12 } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { Action, ActionType, VariableFontDimension, VariableFontStyle } from '../reducer';
import style from '../style.module.css';
import { VariableFontEditable } from './VariableFontEditable';
import { VariableFontRange } from './VariableFontRange';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
    variableFontName?: string;
}

const EXCLUDED_DIMENSIONS = ['wdth', 'wght'];

const getVariationSetting = (dimensions: Record<string, VariableFontDimension>) =>
    Object.values(dimensions)
        .filter((dimension) => !EXCLUDED_DIMENSIONS.includes(dimension.tag))
        .map((dimension) => `"${dimension.tag}" ${dimension.value}`)
        .join(', ');

export const VariableFontStyleEntry: FC<Props> = ({
    dispatch,
    isEditing,
    variableFontStyle: { dimensions, fontDescription, exampleText, id, name },
    variableFontName,
}) => {
    return (
        <div>
            <div className={style['example-text__wrapper']}>
                <p
                    className={style['example-text']}
                    style={{
                        fontFamily: `"${variableFontName}"`,
                        fontWeight: dimensions?.wght ? dimensions.wght.value : undefined,
                        fontStretch: dimensions?.wdth ? `${dimensions.wdth.value}%` : undefined,
                        fontVariationSettings: getVariationSetting(dimensions),
                    }}
                >
                    {exampleText}
                </p>
                <div className={style['style-info-container']}>
                    <div className="tw-pb-4 tw-flex">
                        <div className={style['style-info__header']}>
                            <VariableFontEditable
                                isEditing={isEditing}
                                onEditableSave={function (value: string): void {
                                    dispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            id,
                                            partial: { name: value },
                                        },
                                    });
                                }}
                            >
                                <h6 className="tw-font-bold tw-text-left">{name}</h6>
                            </VariableFontEditable>
                            <VariableFontEditable
                                isEditing={isEditing}
                                hidePen
                                onEditableSave={function (value: string): void {
                                    dispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            id,
                                            partial: { fontDescription: value },
                                        },
                                    });
                                }}
                            >
                                <p className="tw-text-left">
                                    {fontDescription}
                                    {isEditing && <IconPen12 />}
                                </p>
                            </VariableFontEditable>
                        </div>
                        <div className="tw-flex-shrink-0">
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
                    {Object.values(dimensions).map((dimension) => (
                        <VariableFontRange
                            key={dimension.tag}
                            id={id}
                            isEditing={isEditing}
                            dimension={dimension}
                            dispatch={dispatch}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
