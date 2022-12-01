/* (c) Copyright Frontify Ltd., all rights reserved. */
import { AppBridgeBlock, useBlockAssets, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { Button, ButtonStyle, IconPlusCircle } from '@frontify/fondue';
import { Font } from 'lib-font';
import { FC, useEffect, useReducer } from 'react';

import { EmptyState } from './components/EmptyState';
import { StyleEntry } from './components/StyleEntry/StyleEntry';
import { ActionType, State, VariableFontDefaultDimension, getStylesArray, hasStyles, reducer } from './reducer';
import { ASSET_SETTINGS_ID } from './settings';
import style from './style.module.css';

type Props = {
    appBridge: AppBridgeBlock;
};

const extensionMap: Record<string, string> = {
    ttf: 'truetype-variations',
};

export const VariableFontStylesBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [settings, setSettings] = useBlockSettings(appBridge);
    const { blockAssets } = useBlockAssets(appBridge);
    const currentAsset = blockAssets[ASSET_SETTINGS_ID]?.length > 0 ? blockAssets[ASSET_SETTINGS_ID][0] : undefined;
    const [state, dispatch] = useReducer(
        reducer,
        (settings.fontStyles as State) || { styles: {}, defaultDimensions: {} }
    );

    useEffect(() => {
        setSettings({ fontStyles: state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    useEffect(() => {
        if (currentAsset && currentAsset.id !== state.assetId) {
            const font = new Font(currentAsset.fileName, {
                skipStyleSheet: true,
            });

            font.src = currentAsset.originUrl;

            font.onload = (event: { detail: { font: any } }) => {
                const font = event.detail.font;
                const otTables = font.opentype.tables;

                // get variable font axes
                const axes: Record<string, VariableFontDefaultDimension> = otTables.fvar.axes;
                const dimensions = Object.values(axes);
                const dimensionsObj = dimensions.reduce<Record<string, VariableFontDefaultDimension>>(
                    (previous, current) => {
                        previous[current.tag] = current;
                        return previous;
                    },
                    {}
                );

                dispatch({ type: ActionType.SetDimensions, payload: dimensionsObj });
                dispatch({ type: ActionType.EditAssetId, payload: { id: currentAsset.id } });
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentAsset]);

    return (
        <div className={style.container}>
            {!hasStyles(state) && (
                <EmptyState isEditing={isEditing} dispatch={dispatch} hasAssetLoaded={!!currentAsset} />
            )}
            {hasStyles(state) && (
                <div className={style['styles-container']}>
                    {currentAsset && (
                        <style>
                            {`
                                @font-face {
                                    font-family: "${currentAsset?.title}";
                                    src:
                                        url("${currentAsset.originUrl}")
                                        format("${extensionMap[currentAsset?.extension || 'truetype-variations']}");
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
