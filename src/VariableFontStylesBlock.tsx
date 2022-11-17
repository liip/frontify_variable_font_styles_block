/* (c) Copyright Frontify Ltd., all rights reserved. */
import { AppBridgeBlock, useBlockAssets, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { Button, ButtonStyle, IconPlusCircle } from '@frontify/fondue';
import { FC, useEffect, useReducer } from 'react';

import { EmptyState } from './components/EmptyState';
import { VariableFontStyleEntry } from './components/VariableFontStyleEntry';
import { ActionType, VariableFontStyle, getStylesArray, hasStyles, reducer } from './reducer';
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
    const currentAssets = blockAssets[ASSET_SETTINGS_ID]?.length > 0 ? blockAssets[ASSET_SETTINGS_ID][0] : undefined;
    const [state, dispatch] = useReducer(reducer, (settings.fontStyles as Record<string, VariableFontStyle>) || {});

    useEffect(() => {
        setSettings({ fontStyles: state });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state]);

    return (
        <div className={style.container}>
            {!hasStyles(state) && <EmptyState isEditing={isEditing} dispatch={dispatch} />}
            {hasStyles(state) && (
                <div className={style['styles-container']}>
                    {currentAssets && (
                        <style>
                            {`
                                @font-face {
                                    font-family: "${currentAssets?.title}";    
                                    src:
                                        url("${currentAssets.originUrl}")
                                        format("${extensionMap[currentAssets?.extension || 'truetype-variations']}");
                                    font-weight: 100 900;
                                }
                            `}
                        </style>
                    )}
                    <div className={style['style-container']}>
                        {getStylesArray(state).map((variableFontStyle) => (
                            <VariableFontStyleEntry
                                key={variableFontStyle.id}
                                variableFontName={currentAssets?.title}
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
