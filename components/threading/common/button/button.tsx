// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {memo, ButtonHTMLAttributes, ReactNode} from 'react';
import classNames from 'classnames';

import './button.scss';

type Props = {
    prepend?: ReactNode;
    append?: ReactNode;
    isActive?: boolean;
    hasDot?: boolean;
    allowTextOverflow?: boolean;
    marginTop?: boolean;
}

type Attrs = Exclude<ButtonHTMLAttributes<HTMLButtonElement>, Props>

function Button({
    prepend,
    append,
    children,
    isActive,
    hasDot,
    marginTop,
    allowTextOverflow = false,
    ...attrs
}: Props & Attrs) {
    return (
        <button
            {...attrs}
            className={classNames('Button Button___transparent', {'is-active': isActive, allowTextOverflow}, attrs.className)}
            data-testid='Button___transparent'
        >
            {prepend && (
                <span
                    data-testid='Button_prepended'
                    className='Button_prepended'
                >
                    {prepend}
                </span>
            )}
            <span className={classNames('Button_label', {margin_top: marginTop})}>
                {children}
                {hasDot && <span className='dot'/>}
            </span>
            {append && (
                <span
                    data-testid='Button_appended'
                    className='Button_appended'
                >
                    {append}
                </span>
            )}
        </button>
    );
}

export default memo(Button);
