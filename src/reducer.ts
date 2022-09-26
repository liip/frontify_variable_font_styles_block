import { FrontifyAsset, FrontifyColor } from '@frontify/app-bridge';
import { nanoid } from 'nanoid';

export interface VariableFontStyle {
    id: string;
    name: string;
    exampleText: string;
    allowedColors: FrontifyColor[];
    currentColor?: FrontifyColor;
    asset?: FrontifyAsset;
    // Hardcode this to only use weight
    // TODO Find solution to add custom min and max values
    // TODO Find solution for arbitrary dimensions
    weight?: string;
    hasFlyoutOpen?: boolean;
}

export type State = Record<string, VariableFontStyle>;

export enum ActionType {
    Edit = 'edit',
    EditAllowedColors = 'editAllowedColors',
    Delete = 'delete',
    Add = 'add',
}

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

type ActionDelete = {
    type: ActionType.Delete;
    payload: {
        id: string;
    };
};

type ActionAdd = {
    type: ActionType.Add;
};

export type Action = ActionEdit | ActionEditAllowedColors | ActionDelete | ActionAdd;

export const defaultExampleText = 'The quick brown fox jumps over the lazy dog';

const createDefaultFontStyle = (id: string): VariableFontStyle => ({
    id,
    allowedColors: [],
    name: 'Unnamed style',
    exampleText: defaultExampleText,
    weight: '400',
});

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.Edit:
            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    ...action.payload.partial,
                },
            };

        case ActionType.EditAllowedColors:
            const newColors = action.payload.isAdded
                ? [...state[action.payload.id].allowedColors, action.payload.color]
                : state[action.payload.id].allowedColors.filter((a) => a.name !== action.payload.color.name);

            return {
                ...state,
                [action.payload.id]: {
                    ...state[action.payload.id],
                    allowedColors: newColors,
                },
            };

        case ActionType.Delete:
            const next = { ...state };
            delete next[action.payload.id];
            return next;

        case ActionType.Add:
            const id = nanoid();
            return {
                ...state,
                [id]: createDefaultFontStyle(id),
            };

        default:
            return state;
    }
}

export const getStylesArray = (styles: Record<string, VariableFontStyle>): VariableFontStyle[] =>
    Object.values(styles).filter((s: VariableFontStyle) => s);

export const hasStyles = (state: State) => state && getStylesArray(state).length > 0;
