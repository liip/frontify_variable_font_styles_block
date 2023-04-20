import { EditableText, IconPen12 } from '@frontify/fondue';
import React, { ReactElement } from 'react';

interface EditableTextWrapperProps {
    children?: ReactElement;
    isEditing?: boolean;
    onEditableSave: (value: string) => void;
}

export const EditableTextWrapper = ({ children, isEditing, onEditableSave }: EditableTextWrapperProps) => {
    return isEditing ? (
        <div>
            <EditableText options={{ isSlimInputField: true, removeBoxPadding: true }} onEditableSave={onEditableSave}>
                <div className="tw-flex tw-items-center tw-gap-1">
                    {children}
                    <span className="tw-shrink-0">
                        <IconPen12 />
                    </span>
                </div>
            </EditableText>
        </div>
    ) : (
        <div>{children}</div>
    );
};
