import { EditableText, IconPen12 } from '@frontify/fondue';
import React, { ReactElement } from 'react';

interface EditableTextWrapperProps {
    children?: ReactElement;
    isEditing?: boolean;
    hidePen?: boolean;
    onEditableSave: (value: string) => void;
}

export const EditableTextWrapper = ({ children, isEditing, hidePen, onEditableSave }: EditableTextWrapperProps) => {
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
