import React, { FC } from 'react';
import { VariableFontDimension, defaultExampleText } from '../../reducer';

import style from './ExampleText.module.css';

const EXCLUDED_DIMENSIONS = ['wdth', 'wght'];

const getVariationSetting = (dimensions: Record<string, VariableFontDimension>) =>
    Object.values(dimensions)
        .filter((dimension) => !EXCLUDED_DIMENSIONS.includes(dimension.tag))
        .map((dimension) => `"${dimension.tag}" ${dimension.value}`)
        .join(', ');

interface ExampleTextProps {
    dimensions: Record<string, VariableFontDimension>;
    exampleText: string;
    variableFontName?: string;
}

export const ExampleTextPreview = () => {
    return <p className={`${style['example-text']} ${style['example-text--blurred']}`}>{defaultExampleText}</p>;
};

export const ExampleText: FC<ExampleTextProps> = ({ dimensions, exampleText, variableFontName }) => {
    return (
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
    );
};
