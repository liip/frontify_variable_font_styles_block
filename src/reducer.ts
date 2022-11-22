import { FrontifyColor } from '@frontify/app-bridge';
import { nanoid } from 'nanoid';

export interface VariableFontDefaultDimension {
    tag: string;
    minValue: string;
    maxValue: string;
    defaultValue: string;
}

export interface VariableFontDimension extends VariableFontDefaultDimension {
    editorMinValue: string;
    editorMaxValue: string;
    editorDefault: string;
    value: string;
    isValueRange: boolean;
}

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
    defaultDimensions: Record<string, VariableFontDefaultDimension>;
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
    payload: Record<string, VariableFontDefaultDimension>;
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

const mapDefaultsToFontStyle = (defaults: VariableFontDefaultDimension): VariableFontDimension => ({
    tag: defaults.tag,
    minValue: defaults.minValue,
    maxValue: defaults.minValue,
    defaultValue: defaults.defaultValue,
    editorMinValue: defaults.minValue,
    editorMaxValue: defaults.maxValue,
    editorDefault: defaults.defaultValue,
    value: defaults.defaultValue,
    isValueRange: false,
});

const createDefaultFontStyle = (
    id: string,
    dimensions: Record<string, VariableFontDefaultDimension>
): VariableFontStyle => ({
    id,
    name: 'Unnamed style',
    exampleText: defaultExampleText,
    weight: '400',
    fontDescription: defaultDescriptionText,
    dimensions: resetDims(Object.values(dimensions).map(mapDefaultsToFontStyle)),
});

const resetStylesArray = (
    styles: VariableFontStyle[],
    payload: Record<string, VariableFontDefaultDimension>
): VariableFontStyle[] => {
    return styles.map((style) => ({
        ...style,
        dimensions: resetDims(Object.values(payload).map(mapDefaultsToFontStyle)),
    }));
};

const resetDims = (styles: VariableFontDimension[]) =>
    styles.reduce<Record<string, VariableFontDimension>>((accumulator, current) => {
        accumulator[current.tag] = current;
        return accumulator;
    }, {});

const resetStyles = (styles: VariableFontStyle[]) =>
    styles.reduce<Record<string, VariableFontStyle>>((accumulator, current) => {
        accumulator[current.id] = current;
        return accumulator;
    }, {});

export function reducer(state: State, action: Action): State {
    switch (action.type) {
        case ActionType.SetDimensions:
            return {
                defaultDimensions: action.payload,
                styles: resetStyles(resetStylesArray(Object.values(state.styles || {}), action.payload)),
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
                    [id]: createDefaultFontStyle(id, state.defaultDimensions),
                },
            };

        default:
            return state;
    }
}

export const getStylesArray = (styles: Record<string, VariableFontStyle>): VariableFontStyle[] =>
    Object.values(styles).filter((s: VariableFontStyle) => s);

export const hasStyles = (state: State) => state && state.styles && getStylesArray(state.styles).length > 0;
