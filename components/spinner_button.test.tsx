// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';

import SpinnerButton from 'components/spinner_button';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/SpinnerButton', () => {
    test('should match snapshot with required props', () => {
        const wrapper = renderWithIntl(
            <SpinnerButton
                spinning={false}
                spinningText='Test'
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot with spinning', () => {
        const wrapper = renderWithIntl(
            <SpinnerButton
                spinning={true}
                spinningText='Test'
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot with children', () => {
        const wrapper = renderWithIntl(
            <SpinnerButton
                spinning={false}
                spinningText='Test'
            >
                <span id='child1'/>
                <span id='child2'/>
            </SpinnerButton>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should handle onClick', () => {
        const onClick = jest.fn();

        renderWithIntl(
            <SpinnerButton
                spinning={false}
                onClick={onClick}
                spinningText='Test'
            />,
        );

        fireEvent.click(screen.getByRole('button'));

        expect(onClick).toHaveBeenCalledTimes(1);
    });

    test('should add properties to underlying button', () => {
        renderWithIntl(
            <SpinnerButton
                id='my-button-id'
                className='btn btn-success'
                spinningText='Test'
            />,
        );

        const button = screen.getByRole('button');

        expect(button).not.toBeUndefined();
        expect(button.nodeName).toEqual('BUTTON');
        expect(button.id).toEqual('my-button-id');
        expect(button.classList.contains('btn')).toBeTruthy();
        expect(button.classList.contains('btn-success')).toBeTruthy();
    });
});
