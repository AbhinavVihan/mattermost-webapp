// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';

import ReplyIcon from 'components/widgets/icons/reply_icon';

import {renderWithIntl} from 'tests/react_testing_utils';

import Button from './button';

describe('components/threading/common/button', () => {
    test('should support onClick', () => {
        const action = jest.fn();

        const wrapper = renderWithIntl(
            <Button
                onClick={action}
            />,
        );

        expect(wrapper).toMatchSnapshot();

        fireEvent.click(screen.getByTestId('Button___transparent'));

        expect(action).toHaveBeenCalled();
    });

    test('should support className', () => {
        const className = 'test-class other-test-class';
        const wrapper = renderWithIntl(
            <Button
                className={className}
            />,
        );

        expect(wrapper).toMatchSnapshot();

        const button = screen.getByTestId('Button___transparent');
        expect(button).toHaveClass('test-class');
        expect(button).toHaveClass('other-test-class');
    });

    test('should support prepended content', () => {
        const wrapper = renderWithIntl(
            <Button
                prepend={<ReplyIcon className='Icon'/>}
            />,
        );

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.container.className.includes('Button_prepended ReplyIcon'));
    });

    test('should support appended content', () => {
        const wrapper = renderWithIntl(
            <Button
                append={<ReplyIcon className='Icon'/>}
            />,
        );

        expect(wrapper).toMatchSnapshot();

        expect(wrapper.container.className.includes('Button_appended ReplyIcon'));
    });

    test('should support children', () => {
        const wrapper = renderWithIntl(
            <Button>
                {'text-goes-here'}
            </Button>,
        );

        expect(wrapper).toMatchSnapshot();
        const button = screen.getByTestId('Button___transparent');
        expect(button).toHaveTextContent('text-goes-here');
    });
});
