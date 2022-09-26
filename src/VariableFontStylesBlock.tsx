/* (c) Copyright Frontify Ltd., all rights reserved. */
import { AppBridgeBlock, useBlockSettings, useEditorState } from '@frontify/app-bridge';
import { Button, ButtonStyle, IconPlusCircle } from '@frontify/fondue';
import { FC, useEffect, useReducer } from 'react';

import { EmptyState } from './components/EmptyState';
import { VariableFontStyleEntry } from './components/VariableFontStyleEntry';
import { ActionType, VariableFontStyle, getStylesArray, hasStyles, reducer } from './reducer';
import style from './style.module.css';

type Props = {
    appBridge: AppBridgeBlock;
};

export const VariableFontStylesBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [settings, setSettings] = useBlockSettings(appBridge);
    const [state, dispatch] = useReducer(reducer, (settings.fontStyles as Record<string, VariableFontStyle>) || {});

    useEffect(() => {
        setSettings({ fontStyles: state });
    }, [setSettings, state]);

    return (
        <div className={style.container}>
            {!hasStyles(state) && <EmptyState isEditing={isEditing} dispatch={dispatch} />}
            {hasStyles(state) && (
                <div className={style['styles-container']}>
                    <div className={style['style-container']}>
                        {getStylesArray(state).map((variableFontStyle) => (
                            <VariableFontStyleEntry
                                key={variableFontStyle.id}
                                {...{ appBridge, dispatch, isEditing, variableFontStyle }}
                            />
                        ))}
                    </div>
                    <Button
                        hugWidth
                        icon={<IconPlusCircle />}
                        style={ButtonStyle.Secondary}
                        onClick={() => dispatch({ type: ActionType.Add })}
                    >
                        Add new style
                    </Button>
                </div>
            )}
        </div>
    );
};
