// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {fireEvent, screen} from '@testing-library/react';
import React from 'react';

import {renderWithIntl} from 'tests/react_testing_utils';

import ConfirmModal from './confirm_modal';

describe('ConfirmModal', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    const baseProps = {
        show: true,
        onConfirm,
        onCancel,
    };

    test('should pass checkbox state when confirm is pressed', () => {
        const props = {
            ...baseProps,
            showCheckbox: true,
        };

        renderWithIntl(<ConfirmModal {...props}/>);
        expect(screen.getByTestId('confirm_modal-checkbox')).toBeValid();
        expect(screen.getByTestId('confirm_modal-checkbox')).not.toBeChecked();

        fireEvent.click(screen.getByTestId('confirmModalButton'));

        expect(onConfirm).toHaveBeenCalledWith(false);

        fireEvent.click(screen.getByTestId('confirm_modal-checkbox'));
        expect(screen.getByTestId('confirm_modal-checkbox')).toBeChecked();
        fireEvent.click(screen.getByTestId('confirmModalButton'));

        expect(onConfirm).toHaveBeenCalledWith(true);
    });

    test('should pass checkbox state when cancel is pressed', () => {
        const props = {
            ...baseProps,
            showCheckbox: true,
        };

        renderWithIntl(<ConfirmModal {...props}/>);

        expect(screen.getByTestId('confirm_modal-checkbox')).toBeValid();
        expect(screen.getByTestId('confirm_modal-checkbox')).not.toBeChecked();
        fireEvent.click(screen.getByTestId('cancelModalButton'));

        expect(onCancel).toHaveBeenCalledWith(false);
        fireEvent.click(screen.getByTestId('confirm_modal-checkbox'));
        expect(screen.getByTestId('confirm_modal-checkbox')).toBeChecked();

        fireEvent.click(screen.getByTestId('cancelModalButton'));

        expect(onCancel).toHaveBeenCalledWith(true);
    });
});
