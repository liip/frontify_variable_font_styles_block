import { AppBridgeBlock, FrontifyAsset, FrontifyColor, useAssetChooser } from '@frontify/app-bridge';
import {
    AssetInput,
    AssetInputSize,
    Button,
    ButtonStyle,
    Checkbox,
    CheckboxState,
    Color,
    Flyout,
    FormControl,
    IconMinusCircle,
    IconPen,
    IconTypographyBox,
    TextInput,
} from '@frontify/fondue';
import React, { Dispatch, FC } from 'react';
import usePromise from 'react-use-promise';

import { Action, ActionType, VariableFontStyle, defaultExampleText } from '../reducer';
import style from '../style.module.css';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
}

const extensionMap: Record<string, string> = {
    ttf: 'truetype-variations',
};

const toRgbaString = (color: FrontifyColor): string => {
    return `rgba(${color.red}, ${color.green}, ${color.blue}, ${color.alpha})`;
};

export const VariableFontStyleEntry: FC<Props> = ({
    appBridge,
    dispatch,
    isEditing,
    variableFontStyle: { allowedColors, asset, id, hasFlyoutOpen, name, weight },
}) => {
    const assetChooser = useAssetChooser(appBridge);
    const [result /*, error, state*/] = usePromise(() => appBridge.getColors(), []);

    return (
        <div>
            {asset && (
                <style>
                    {`
                        @font-face {
                            font-family: "${asset?.title}";    
                            src:
                                url("${(asset as FrontifyAsset & { download_url: string }).download_url}")
                                format("${extensionMap[asset?.extension || 'truetype-variations']}");
                            font-weight: 100 900;
                        }
                    `}
                </style>
            )}
            <div className={style['style-name']}>{name}</div>
            <div className={style['example-text__wrapper']}>
                <p
                    className={style['example-text']}
                    style={{
                        fontFamily: asset?.title,
                        fontWeight: weight,
                    }}
                >
                    {defaultExampleText}
                </p>
                {isEditing && (
                    <div className={style['example-text__edit-wrapper']}>
                        <Flyout
                            isOpen={hasFlyoutOpen}
                            trigger={
                                <Button
                                    icon={<IconPen />}
                                    onClick={() =>
                                        dispatch({
                                            type: ActionType.Edit,
                                            payload: {
                                                id,
                                                partial: { hasFlyoutOpen: !hasFlyoutOpen },
                                            },
                                        })
                                    }
                                    style={ButtonStyle.Secondary}
                                >
                                    Edit Style
                                </Button>
                            }
                            onOpenChange={(isOpen) =>
                                dispatch({
                                    type: ActionType.Edit,
                                    payload: {
                                        id,
                                        partial: { hasFlyoutOpen: isOpen },
                                    },
                                })
                            }
                            onCancel={() =>
                                dispatch({
                                    type: ActionType.Edit,
                                    payload: {
                                        id,
                                        partial: { hasFlyoutOpen: false },
                                    },
                                })
                            }
                        >
                            <div className={style['overlay-container']}>
                                <FormControl
                                    label={{
                                        children: 'Style name',
                                        htmlFor: `style${id}styleName`,
                                    }}
                                >
                                    <TextInput
                                        value={name}
                                        onChange={(value) =>
                                            dispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    id,
                                                    partial: { name: value },
                                                },
                                            })
                                        }
                                    ></TextInput>
                                </FormControl>
                                <FormControl
                                    label={{
                                        children: 'Style name',
                                        htmlFor: `style${id}fontAsset`,
                                    }}
                                >
                                    <AssetInput
                                        size={AssetInputSize.Small}
                                        assets={
                                            asset
                                                ? ([
                                                      {
                                                          type: 'icon',
                                                          icon: <IconTypographyBox />,
                                                          name: asset?.title,
                                                          extension: asset.extension,
                                                          size: asset.fileSize,
                                                          source: 'library',
                                                          sourceName: 'random',
                                                      },
                                                  ] as any)
                                                : undefined
                                        }
                                        numberOfLocations={1}
                                        onLibraryClick={() => {
                                            assetChooser.openAssetChooser((a) => {
                                                console.log('assets', a);
                                                assetChooser.closeAssetChooser();
                                                dispatch({
                                                    type: ActionType.Edit,
                                                    payload: {
                                                        id,
                                                        partial: { asset: a[0], hasFlyoutOpen: true },
                                                    },
                                                });
                                            }, {});
                                            dispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    id,
                                                    partial: { hasFlyoutOpen: false },
                                                },
                                            });
                                        }}
                                        acceptFileType="ttf"
                                    />
                                </FormControl>
                                <FormControl
                                    label={{
                                        children: 'Font width',
                                        htmlFor: `style${id}fontWidth`,
                                    }}
                                >
                                    <input
                                        type="range"
                                        min="100"
                                        max="900"
                                        value={weight}
                                        onChange={(event) => {
                                            dispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    id,
                                                    partial: { weight: event.target.value },
                                                },
                                            });
                                        }}
                                    ></input>
                                </FormControl>
                                <FormControl>
                                    {result &&
                                        result.length > 0 &&
                                        result.map((r, index) => (
                                            <div key={index}>
                                                <Checkbox
                                                    label={r.name}
                                                    value={r.name}
                                                    state={
                                                        allowedColors.some((a) => a.name === r.name)
                                                            ? CheckboxState.Checked
                                                            : CheckboxState.Unchecked
                                                    }
                                                    onChange={(isChecked) =>
                                                        dispatch({
                                                            type: ActionType.EditAllowedColors,
                                                            payload: {
                                                                id,
                                                                color: r,
                                                                isAdded: isChecked,
                                                            },
                                                        })
                                                    }
                                                ></Checkbox>
                                                <div
                                                    className={style.miniswatch}
                                                    style={{ backgroundColor: toRgbaString(r) }}
                                                ></div>
                                            </div>
                                        ))}
                                </FormControl>
                            </div>
                        </Flyout>
                        <Button
                            hugWidth
                            icon={<IconMinusCircle />}
                            style={ButtonStyle.Secondary}
                            onClick={() =>
                                dispatch({
                                    type: ActionType.Delete,
                                    payload: {
                                        id,
                                    },
                                })
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
