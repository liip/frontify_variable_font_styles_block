import { EditableText, IconPen12 } from '@frontify/fondue';
import React, { ReactElement } from 'react';

// import style from '../style.module.css';

interface VariableFontsEditableProps {
    children?: ReactElement;
    isEditing?: boolean;
    hidePen?: boolean;
    onEditableSave: (value: string) => void;
}

export const VariableFontEditable = ({ children, isEditing, hidePen, onEditableSave }: VariableFontsEditableProps) => {
    return isEditing ? (
        <div>
            <EditableText options={{ isSlimInputField: true, removeBoxPadding: true }} onEditableSave={onEditableSave}>
                <>
                    {children}
                    {!hidePen && <IconPen12 />}
                </>
            </EditableText>
        </div>
    ) : (
        <div>{children}</div>
    );
};
