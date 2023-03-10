// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {screen} from '@testing-library/react';

import MessageSubmitError from 'components/message_submit_error';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/MessageSubmitError', () => {
    const baseProps = {
        handleSubmit: jest.fn(),
    };

    it('should display the submit link if the error is for an invalid slash command', () => {
        const error = {
            message: 'No command found',
            server_error_id: 'api.command.execute_command.not_found.app_error',
        };
        const submittedMessage = 'fakecommand some text';

        const props = {
            ...baseProps,
            error,
            submittedMessage,
        };

        const wrapper = renderWithIntl(
            <MessageSubmitError {...props}/>,
        );

        expect(wrapper.container.querySelector('#message_submit_error.invalidCommand')).toBeDefined();

        expect(screen.getByTestId('control-label').textContent).not.toBe('No command found');
    });

    it('should not display the submit link if the error is not for an invalid slash command', () => {
        const error = {
            message: 'Some server error',
            server_error_id: 'api.other_error',
        };
        const submittedMessage = '/fakecommand some text';

        const props = {
            ...baseProps,
            error,
            submittedMessage,
        };

        const wrapper = renderWithIntl(
            <MessageSubmitError {...props}/>,
        );

        expect(wrapper.container.querySelector('#message_submit_error.invalidCommand')).toBeNull();

        expect(screen.getByTestId('control-label').textContent).toBe('Some server error');
    });
});
