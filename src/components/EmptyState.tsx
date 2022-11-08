import { Button, ButtonStyle, IconPlusCircle, Text } from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';

import { Action, ActionType, defaultExampleText } from '../reducer';
import style from '../style.module.css';

type Props = {
    dispatch: Dispatch<Action>;
    isEditing: boolean;
};

export const EmptyState: FC<Props> = ({ isEditing, dispatch }) => {
    return (
        <>
            <p className={`${style['example-text']} ${style['example-text--blurred']}`}>{defaultExampleText}</p>
            {isEditing && (
                <div className={style['empty-container']}>
                    <Text size="large">Add a variable font in the settings and then</Text>
                    <Button
                        icon={<IconPlusCircle />}
                        onClick={() => dispatch({ type: ActionType.Add })}
                        style={ButtonStyle.Secondary}
                    >
                        Add a variable font style
                    </Button>
                </div>
            )}
        </>
    );
};
