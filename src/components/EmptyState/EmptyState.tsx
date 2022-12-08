import { Button, ButtonStyle, Heading, IconPlusCircle, Text } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { Action, ActionType } from '../../reducer';
import emptyState from './EmptyState.module.css';
import { ExampleTextPreview } from '../ExampleText';

type Props = {
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    hasAssetLoaded?: boolean;
};

export const EmptyState: FC<Props> = ({ isEditing, dispatch, hasAssetLoaded }) => {
    return (
        <>
            <ExampleTextPreview />
            {isEditing && (
                <div className={emptyState['empty-container']}>
                    <div>
                        <Heading as="h1" size="large" weight="strong">
                            👋 To get started with the Variable Font Styles block, take the following steps:
                        </Heading>
                        <Text as="p" size="large">
                            1. Add a variable font in the settings
                        </Text>
                        <Text as="p" size="large">
                            2. Click the button to add the your first variable font style
                        </Text>
                        <Button
                            disabled={!hasAssetLoaded}
                            icon={<IconPlusCircle />}
                            onClick={() => dispatch({ type: ActionType.Add })}
                            style={ButtonStyle.Secondary}
                        >
                            Add font style {!hasAssetLoaded && ' (load font first)'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
