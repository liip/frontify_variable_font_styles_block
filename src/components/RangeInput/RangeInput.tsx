import React, { Fragment } from 'react';

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
    position: 'absolute',
    width: '100%',
    height: 16,
    transform: 'translate(0%, -50%)',
    borderRadius: 7,
    cursor: 'pointer',
    // border: '1px solid white',
};

const railInnerStyle = {
    position: 'absolute',
    width: '100%',
    height: 6,
    transform: 'translate(0%, -50%)',
    borderRadius: 7,
    // pointerEvents: 'none',
    backgroundColor: 'rgb(200,200,200)',
};

export function SliderRail({ getRailProps }: any) {
    return (
        <Fragment>
            <div style={railOuterStyle} {...getRailProps()} />
            <div style={railInnerStyle as any} />
        </Fragment>
    );
}

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
export function Handle({ domain: [min, max], handle: { id, value, percent }, disabled, getHandleProps }: any) {
    return (
        <Fragment>
            <div
                style={{
                    left: `${percent}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    zIndex: 5,
                    width: 16,
                    height: 16,
                    cursor: 'pointer',
                    backgroundColor: disabled ? 'rgba(231,231,231,1)' : 'rgba(70,70,70,1)',
                    borderRadius: '50%',
                }}
                {...getHandleProps(id)}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                style={{
                    left: `${percent}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    width: 24,
                    height: 24,
                }}
            />
        </Fragment>
    );
}

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export function KeyboardHandle({ domain: [min, max], handle: { id, value, percent }, disabled, getHandleProps }: any) {
    return (
        <button
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            style={{
                left: `${percent}%`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                width: 24,
                height: 24,
                borderRadius: '50%',
                boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
                backgroundColor: disabled ? '#666' : '#ffc400',
            }}
            {...getHandleProps(id)}
        />
    );
}

// *******************************************************
// TRACK COMPONENT
// *******************************************************
export function Track({ source, target, getTrackProps, disabled }: any) {
    return (
        <div
            style={{
                position: 'absolute',
                transform: 'translate(0%, -50%)',
                height: 6,
                zIndex: 1,
                backgroundColor: disabled ? 'rgba(260,260,260,1)' : 'rgba(150,150,150,1)',
                borderRadius: 7,
                cursor: 'pointer',
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    );
}
