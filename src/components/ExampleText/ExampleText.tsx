import React, { Dispatch, FC, VFC } from 'react';
import { Action, ActionType, VariableFontDimension, defaultExampleText } from '../../reducer';
import { EditableTextWrapper } from '../EditableTextWrapper';

import style from './ExampleText.module.css';

const EXCLUDED_DIMENSIONS = ['wdth', 'wght'];

const getVariationSetting = (dimensions: Record<string, VariableFontDimension>) =>
    Object.values(dimensions)
        .filter((dimension) => !EXCLUDED_DIMENSIONS.includes(dimension.tag))
        .map((dimension) => `"${dimension.tag}" ${dimension.value}`)
        .join(', ');

export const ExampleTextPreview: VFC = () => {
    return <p className={`${style['example-text']} ${style['example-text--blurred']}`}>{defaultExampleText}</p>;
};

interface ExampleTextProps {
    dispatch: Dispatch<Action>;
    exampleText: string;
    id: string;
    isEditing: boolean;
    localDimensions: Record<string, VariableFontDimension>;
    variableFontName?: string;
}

export const ExampleText: FC<ExampleTextProps> = ({
    dispatch,
    exampleText,
    isEditing,
    id,
    localDimensions,
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
                        fontWeight: localDimensions?.wght ? localDimensions.wght.value : undefined,
                        fontStretch: localDimensions?.wdth ? `${localDimensions.wdth.value}%` : undefined,
                        fontVariationSettings: getVariationSetting(localDimensions),
                    }}
                >
                    {exampleText}
                </p>
            </EditableTextWrapper>
        </div>
    );
};
