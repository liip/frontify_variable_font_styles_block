import { useBlockAssets, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { Button, ButtonStyle, IconPlusCircle } from '@frontify/fondue';
import { BlockProps } from '@frontify/guideline-blocks-settings';
import { Font } from 'lib-font';
import React, { FC, useEffect, useReducer, useState } from 'react';

import { EmptyState } from './components/EmptyState';
import { StyleEntry } from './components/StyleEntry';
import {
    ActionType,
    State,
    VariableFontDefaultDimension,
    createObject,
    getStylesArray,
    hasStyles,
    reducer,
} from './reducer';
import { ALLOWED_EXTENSIONS, ASSET_SETTINGS_ID } from './settings';
import style from './style.module.css';

interface FontType {
    opentype: {
        tables: {
            fvar?: {
                axes: Record<string, VariableFontDefaultDimension>;
            };
        };
    };
}

const extensionMap: Record<string, string> = {
    otf: 'opentype-variations',
    ttf: 'truetype-variations',
    woff2: 'woff2-variations',
};

export const VariableFontStylesBlock: FC<BlockProps> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [settings, setSettings] = useBlockSettings(appBridge);
    const { blockAssets } = useBlockAssets(appBridge);
    const currentAsset = blockAssets[ASSET_SETTINGS_ID]?.length > 0 ? blockAssets[ASSET_SETTINGS_ID][0] : undefined;
    const [state, dispatch] = useReducer(
        reducer,
        (settings.fontStyles as State) || { styles: {}, defaultDimensions: {} }
    );
    const [error, setError] = useState('');

    useEffect(() => {
        setSettings({ fontStyles: state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (currentAsset && currentAsset.id !== state.assetId) {
            if (ALLOWED_EXTENSIONS.includes(currentAsset.extension)) {
                const font = new Font(currentAsset.fileName, {
                    skipStyleSheet: true,
                });
                font.src = currentAsset.originUrl;
                font.onload = (event: { detail: { font: FontType } }) => {
                    const font = event.detail.font;
                    const otTables = font.opentype.tables;

                    if (otTables.fvar) {
                        const axes = otTables.fvar.axes;
                        const axesArray = Object.values(axes);
                        if (
                            axesArray.every(
                                (axis) =>
                                    axis.minValue !== (null || undefined) &&
                                    axis.maxValue !== (null || undefined) &&
                                    axis.tag
                            )
                        ) {
                            const dimensionsArray = axesArray.map((axis) => ({
                                ...axis,
                                defaultValue: axis.defaultValue || (axis.maxValue - axis.minValue) / 2 + axis.minValue,
                            }));
                            const dimensions = createObject<
                                VariableFontDefaultDimension,
                                keyof VariableFontDefaultDimension
                            >(dimensionsArray, 'tag');
                            dispatch({ type: ActionType.SetDimensions, payload: dimensions });
                            dispatch({ type: ActionType.EditAssetId, payload: { id: currentAsset.id } });
                        } else {
                            setError(
                                'The variable font you added is missing data required for the block to work. Please add a different font.'
                            );
                        }
                    } else {
                        setError(
                            'The font you added does not seem to be a variable font. Please add a different font.'
                        );
                    }
                };
            } else {
                setError('The file you added is not a font file. Please add a font file.');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAsset]);

    return (
        <div className={style.container}>
            {error && error}
            {!hasStyles(state) && !error && (
                <EmptyState isEditing={isEditing} dispatch={dispatch} hasAssetLoaded={!!currentAsset} />
            )}
            {hasStyles(state) && !error && (
                <div className={style['styles-container']}>
                    {currentAsset && (
                        <style>
                            {`
                                @font-face {
                                    font-family: "${currentAsset?.title}";
                                    src:
                                        url("${currentAsset.originUrl}")
                                        format("${extensionMap[currentAsset?.extension] || 'truetype-variations'}");
                                    ${
                                        state.defaultDimensions.wght.minValue && state.defaultDimensions.wght.maxValue
                                            ? `font-weight: ${state.defaultDimensions.wght.minValue} ${state.defaultDimensions.wght.maxValue};`
                                            : ''
                                    }
                                    ${
                                        state.defaultDimensions.wdth.minValue && state.defaultDimensions.wdth.maxValue
                                            ? `font-stretch: ${state.defaultDimensions.wdth.minValue}% ${state.defaultDimensions.wdth.maxValue}%;`
                                            : ''
                                    }
                                }
                            `}
                        </style>
                    )}
                    <div className={style['style-container']}>
                        {getStylesArray(state.styles).map((variableFontStyle) => (
                            <StyleEntry
                                key={variableFontStyle.id}
                                variableFontName={currentAsset?.title}
                                {...{ appBridge, dispatch, isEditing, variableFontStyle }}
                            />
                        ))}
                    </div>
                    {isEditing && (
                        <Button
                            hugWidth
                            icon={<IconPlusCircle />}
                            style={ButtonStyle.Secondary}
                            onClick={() => dispatch({ type: ActionType.Add })}
                        >
                            Add new style
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};
