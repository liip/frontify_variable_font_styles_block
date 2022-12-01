import React, { Dispatch, FC } from 'react';
import { Action, ActionType, VariableFontDimension, defaultExampleText } from '../../reducer';
import { EditableTextWrapper } from '../EditableTextWrapper';

import style from './ExampleText.module.css';

const EXCLUDED_DIMENSIONS = ['wdth', 'wght'];

const getVariationSetting = (dimensions: Record<string, VariableFontDimension>) =>
    Object.values(dimensions)
        .filter((dimension) => !EXCLUDED_DIMENSIONS.includes(dimension.tag))
        .map((dimension) => `"${dimension.tag}" ${dimension.value}`)
        .join(', ');

export const ExampleTextPreview = () => {
    return <p className={`${style['example-text']} ${style['example-text--blurred']}`}>{defaultExampleText}</p>;
};

interface ExampleTextProps {
    dimensions: Record<string, VariableFontDimension>;
    dispatch: Dispatch<Action>;
    exampleText: string;
    id: string;
    isEditing: boolean;
    variableFontName?: string;
}

export const ExampleText: FC<ExampleTextProps> = ({
    dimensions,
    dispatch,
    exampleText,
    isEditing,
    id,
    variableFontName,
}) => {
    return (
        <div className={style['example-text__wrapper']}>
            <EditableTextWrapper
                isEditing={isEditing}
                onEditableSave={(value: string) => {
                    dispatch({
                        type: ActionType.Edit,
                        payload: {
                            id,
                            partial: { exampleText: value },
                        },
                    });
                }}
            >
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
            </EditableTextWrapper>
        </div>
    );
};
