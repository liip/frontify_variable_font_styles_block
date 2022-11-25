import { Button, ButtonStyle, Heading, IconPlusCircle, Text } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { Action, ActionType, defaultExampleText } from '../reducer';
import style from '../style.module.css';

type Props = {
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    hasAssetLoaded?: boolean;
};

export const EmptyState: FC<Props> = ({ isEditing, dispatch, hasAssetLoaded }) => {
    return (
        <>
            <p className={`${style['example-text']} ${style['example-text--blurred']}`}>{defaultExampleText}</p>
            {isEditing && (
                <div className={style['empty-container']}>
                    <div>
                        <Heading as="h1" size="large" weight="strong">
                            Take the following steps
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
                            Add font style
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
};
