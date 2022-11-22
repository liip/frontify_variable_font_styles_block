import { FrontifyColor } from '@frontify/app-bridge';
import { nanoid } from 'nanoid';

import { VariableFontDimension } from './VariableFontStylesBlock';

export interface VariableFontStyle {
    id: string;
    name: string;
    exampleText: string;
    // Hardcode this to only use weight
    // TODO Find solution to add custom min and max values
    // TODO Find solution for arbitrary dimensions
    weight?: string;
    dimensions: Record<string, VariableFontDimension>;
    hasFlyoutOpen?: boolean;
    fontDescription: string;
}

export type State = {
    dimensions: Record<string, VariableFontDimension>;
    styles: Record<string, VariableFontStyle>;
};

export enum ActionType {
    SetDimensions = 'setDimensions',
    Edit = 'edit',
    EditAllowedColors = 'editAllowedColors',
    EditDimensions = 'editDimensions',
    Delete = 'delete',
    Add = 'add',
}

type ActionSetDimensions = {
    type: ActionType.SetDimensions;
    payload: Record<string, VariableFontDimension>;
};

type ActionEdit = {
    type: ActionType.Edit;
    payload: {
        id: string;
        partial: Partial<VariableFontStyle>;
    };
};

type ActionEditAllowedColors = {
    type: ActionType.EditAllowedColors;
    payload: {
        id: string;
        isAdded: boolean;
        color: FrontifyColor;
    };
};

type ActionEditDimensions = {
    type: ActionType.EditDimensions;
    payload: { id: string; tag: string; partial: Partial<VariableFontDimension> };
};

type ActionDelete = {
    type: ActionType.Delete;
    payload: {
        id: string;
    };
};

type ActionAdd = {
    type: ActionType.Add;
};

export type Action =
    | ActionSetDimensions
    | ActionEdit
    | ActionEditAllowedColors
    | ActionEditDimensions
    | ActionDelete
    | ActionAdd;

export const defaultExampleText = 'The quick brown fox jumps over the lazy dog';
export const defaultDescriptionText = 'Empty description';

const createDefaultFontStyle = (id: string, dimensions: Record<string, VariableFontDimension>): VariableFontStyle => ({
    id,
    name: 'Unnamed style',
    exampleText: defaultExampleText,
    weight: '400',
    fontDescription: defaultDescriptionText,
    dimensions,
});

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SetDimensions:
            const resetStylesArray = Object.values(state.styles || {}).map((style) => ({
                ...style,
                dimensions: action.payload,
            }));
            const resetStyles = resetStylesArray.reduce<Record<string, VariableFontStyle>>((accumulator, current) => {
                accumulator[current.id] = current;
                return accumulator;
            }, {});

            return {
                dimensions: action.payload,
                styles: resetStyles,
            };

        case ActionType.Edit:
            return {
                ...state,
                styles: {
                    ...state.styles,
                    [action.payload.id]: {
                        ...state.styles[action.payload.id],
                        ...action.payload.partial,
                    },
                },
            };

        case ActionType.EditDimensions:
            return {
                ...state,
                styles: {
                    ...state.styles,
                    [action.payload.id]: {
                        ...state.styles[action.payload.id],
                        dimensions: {
                            ...state.styles[action.payload.id].dimensions,
                            [action.payload.tag]: {
                                ...state.styles[action.payload.id].dimensions[action.payload.tag],
                                ...action.payload.partial,
                            },
                        },
                    },
                },
            };

        case ActionType.Delete:
            const next = { ...state.styles };
            delete next[action.payload.id];
            return {
                ...state,
                styles: next,
            };

        case ActionType.Add:
            const id = nanoid();
            return {
                ...state,
                styles: {
                    ...state.styles,
                    [id]: createDefaultFontStyle(id, state.dimensions),
                },
            };

        default:
            return state;
    }
}

export const getStylesArray = (styles: Record<string, VariableFontStyle>): VariableFontStyle[] =>
    Object.values(styles).filter((s: VariableFontStyle) => s);

export const hasStyles = (state: State) => state && state.styles && getStylesArray(state.styles).length > 0;
