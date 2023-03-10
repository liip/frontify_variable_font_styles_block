import { AppBridgeBlock } from '@frontify/app-bridge';
import { Button, ButtonStyle, Color, Heading, IconMinusCircle, IconPen12 } from '@frontify/fondue';
import React, { Dispatch, FC, useState } from 'react';

import { Action, ActionType, VariableFontStyle } from '../../reducer';
import style from './StyleEntry.module.css';
import { ExampleText } from '../ExampleText';
import { EditableTextWrapper } from '../EditableTextWrapper/EditableTextWrapper';
import { RangeSetting } from '../RangeSetting';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
    variableFontName?: string;
}

export const StyleEntry: FC<Props> = ({
    dispatch,
    isEditing,
    variableFontStyle: { dimensions, fontDescription, exampleText, id, name },
    variableFontName,
}) => {
    const [localDimensions, setLocalDimensions] = useState(dimensions);

    return (
        <div>
            <div className={style['style-entry__wrapper']}>
                <ExampleText {...{ dispatch, exampleText, isEditing, id, localDimensions, variableFontName }} />
                <div className={style['style-entry__container']}>
                    <div className="tw-pb-4 tw-flex">
                        <div className={style['style-entry__header']}>
                            <EditableTextWrapper
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
                                <Heading size="x-large" weight="strong">
                                    {name}
                                </Heading>
                            </EditableTextWrapper>
                            <EditableTextWrapper
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
                            </EditableTextWrapper>
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
                        <RangeSetting
                            key={dimension.tag}
                            id={id}
                            isEditing={isEditing}
                            dispatch={dispatch}
                            localDimension={localDimensions[dimension.tag]}
                            setLocalDimension={(localDimension) =>
                                setLocalDimensions({ ...localDimensions, [dimension.tag]: localDimension })
                            }
                            tag={dimension.tag} // Pass non-local tag to enable debounce
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
