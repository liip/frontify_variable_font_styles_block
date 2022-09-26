import { AppBridgeBlock, FrontifyAsset, useAssetChooser } from '@frontify/app-bridge';
import {
    AssetInput,
    AssetInputSize,
    Button,
    ButtonStyle,
    Color,
    Flyout,
    FormControl,
    IconCross,
    IconMinusCircle,
    IconPen,
    IconTypographyBox,
    TextInput,
    Textarea,
} from '@frontify/fondue';
import React, { ChangeEvent, Dispatch, FC } from 'react';
import usePromise from 'react-use-promise';

import { Action, ActionType, VariableFontStyle } from '../reducer';
import style from '../style.module.css';
import { ColorSelector, getUniqueColorName, toRgbaString } from './ColorSelector';

interface Props {
    appBridge: AppBridgeBlock & { getColors: () => Promise<Color[]> };
    dispatch: Dispatch<Action>;
    isEditing: boolean;
    variableFontStyle: VariableFontStyle;
}

const extensionMap: Record<string, string> = {
    ttf: 'truetype-variations',
};

export const VariableFontStyleEntry: FC<Props> = ({
    appBridge,
    dispatch,
    isEditing,
    variableFontStyle: { allowedColors, asset, currentColor, exampleText, id, hasFlyoutOpen, name, weight },
}) => {
    const assetChooser = useAssetChooser(appBridge);
    const [allColors /*, error, state*/] = usePromise(() => appBridge.getColors(), []);

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

            <div className={style['example-text__wrapper']}>
                <p
                    className={style['example-text']}
                    style={{
                        fontFamily: asset?.title,
                        fontWeight: weight,
                        color: !isEditing && currentColor ? toRgbaString(currentColor) : 'inherit',
                    }}
                >
                    {exampleText}
                </p>
                <div className={style['style-info-container']}>
                    <div>
                        <h6 className={style['style-info__name']}>{name}</h6>
                        <p className={style['style-info__weight']}>
                            Weight: <strong>{weight}</strong>
                        </p>
                    </div>
                    <div className={style['color-selectors-wrapper']}>
                        {allowedColors.map((color) => (
                            <ColorSelector
                                key={getUniqueColorName(id, color)}
                                color={color}
                                id={id}
                                isChecked={
                                    currentColor
                                        ? getUniqueColorName(id, color) === getUniqueColorName(id, currentColor)
                                        : false
                                }
                                handleChange={() => {
                                    dispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            id,
                                            partial: {
                                                currentColor: color,
                                            },
                                        },
                                    });
                                }}
                            />
                        ))}
                        <div>
                            <input
                                type="radio"
                                id={`${id}-no-color`}
                                value={`${id}-no-color`}
                                checked={!currentColor}
                                name={id}
                                onChange={() => {
                                    dispatch({
                                        type: ActionType.Edit,
                                        payload: {
                                            id,
                                            partial: {
                                                currentColor: undefined,
                                            },
                                        },
                                    });
                                }}
                                className="tw-sr-only"
                            ></input>
                            <label htmlFor={`${id}-no-color`}>
                                <div
                                    className={style['color-selector__reset']}
                                    style={{
                                        boxShadow: !currentColor ? '0 0 0 2px rgba(0,0,0,0.3)' : 'none',
                                    }}
                                >
                                    <IconCross />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
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
                                ></Button>
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
                                        children: 'Style font',
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
                                        children: 'Style example text',
                                        htmlFor: `style${id}exampleText`,
                                    }}
                                >
                                    <Textarea
                                        value={exampleText}
                                        onInput={(value) =>
                                            dispatch({
                                                type: ActionType.Edit,
                                                payload: {
                                                    id,
                                                    partial: { exampleText: value },
                                                },
                                            })
                                        }
                                    />
                                </FormControl>
                                <FormControl
                                    label={{
                                        children: `Font weight: ${weight}`,
                                        htmlFor: `style${id}fontWeight`,
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
                                <FormControl
                                    label={{
                                        children: 'Allowed colors',
                                        htmlFor: `style${id}allowedColors`,
                                    }}
                                >
                                    <div className={style['color-selectors-wrapper']}>
                                        {allColors &&
                                            allColors.length > 0 &&
                                            allColors.map((allColor) => (
                                                <ColorSelector
                                                    key={getUniqueColorName(id, allColor)}
                                                    color={allColor}
                                                    id={`selector${id}`}
                                                    isChecked={allowedColors.some(
                                                        (allowedColor) =>
                                                            getUniqueColorName(id, allowedColor) ===
                                                            getUniqueColorName(id, allColor)
                                                    )}
                                                    isMultiSelect
                                                    handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                                                        const isChecked = e.target.checked;
                                                        dispatch({
                                                            type: ActionType.EditAllowedColors,
                                                            payload: {
                                                                id,
                                                                color: allColor,
                                                                isAdded: isChecked,
                                                            },
                                                        });
                                                    }}
                                                />
                                            ))}
                                    </div>
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
