/* (c) Copyright Frontify Ltd., all rights reserved. */
import { AppBridgeBlock, useEditorState } from '@frontify/app-bridge';
import { Button, ButtonStyle, IconPlusCircle } from '@frontify/fondue';
import { FC, useReducer } from 'react';

import { EmptyState } from './components/EmptyState';
import { VariableFontStyleEntry } from './components/VariableFontStyleEntry';
import { ActionType, getStylesArray, hasStyles, reducer } from './reducer';
import style from './style.module.css';

type Props = {
    appBridge: AppBridgeBlock;
};

export const VariableFontStylesBlock: FC<Props> = ({ appBridge }) => {
    const isEditing = useEditorState(appBridge);
    const [state, dispatch] = useReducer(reducer, {});
    console.log(isEditing);

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
