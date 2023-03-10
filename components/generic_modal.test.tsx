// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';

import GenericModal from 'components/generic_modal';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/GenericModal', () => {
    const handleConfirm = jest.fn();
    const handleCancel = jest.fn();
    const requiredProps = {
        onExited: jest.fn(),
        modalHeaderText: 'Modal Header Text',
        children: <></>,
    };

    test('should match snapshot for base case', () => {
        const wrapper = renderWithIntl(
            <GenericModal {...requiredProps}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot with both buttons', () => {
        const props = {
            ...requiredProps,
            handleConfirm,
            handleCancel,
        };

        const wrapper = renderWithIntl(
            <GenericModal {...props}/>,
        );

        expect(wrapper).toMatchSnapshot();
        expect(screen.getByTestId('GenericModal__button_confirm')).not.toBeDisabled();
        expect(screen.getByTestId('GenericModal__button_cancel')).not.toBeDisabled();
    });

    test('should match snapshot with disabled confirm button', () => {
        const props = {
            ...requiredProps,
            handleConfirm: handleCancel,
            isConfirmDisabled: true,
        };

        const wrapper = renderWithIntl(
            <GenericModal {...props}/>,
        );

        expect(wrapper).toMatchSnapshot();
        expect(screen.getByTestId('GenericModal__button_confirm')).toBeDisabled();
    });

    test('should hide and run handleConfirm on confirm button click', (done) => {
        requiredProps.onExited.mockImplementation(() => done());

        const props = {
            ...requiredProps,
            handleConfirm,
        };

        renderWithIntl(
            <GenericModal {...props}/>,
        );

        fireEvent.click(screen.getByTestId('GenericModal__button_confirm'));

        expect(handleConfirm).toHaveBeenCalled();
    });

    test('should hide and run handleCancel on cancel button click', (done) => {
        requiredProps.onExited.mockImplementation(() => done());

        const props = {
            ...requiredProps,
            handleCancel,
        };

        renderWithIntl(
            <GenericModal {...props}/>,
        );

        fireEvent.click(screen.getByTestId('GenericModal__button_cancel'));

        expect(handleCancel).toHaveBeenCalled();
    });
});
