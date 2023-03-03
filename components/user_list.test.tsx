// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {shallow} from 'enzyme';

import {Provider} from 'react-redux';

import {TestHelper} from 'utils/test_helper';

import {renderWithIntl} from 'tests/react_testing_utils';
import store from 'stores/redux_store';

import UserList from './user_list';

describe('components/UserList', () => {
    test('should match default snapshot', () => {
        const props = {
            actionProps: {
                mfaEnabled: false,
                enableUserAccessTokens: false,
                experimentalEnableAuthenticationTransfer: false,
                doPasswordReset: jest.fn(),
                doEmailReset: jest.fn(),
                doManageTeams: jest.fn(),
                doManageRoles: jest.fn(),
                doManageTokens: jest.fn(),
                isDisabled: false,
            },
        };
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <UserList {...props}/>,
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });

    test('should match default snapshot when there are users', () => {
        const User1 = TestHelper.getUserMock({id: 'id1'});
        const User2 = TestHelper.getUserMock({id: 'id2'});
        const props = {
            users: [
                User1,
                User2,
            ],
            actionUserProps: {},
            actionProps: {
                mfaEnabled: false,
                enableUserAccessTokens: false,
                experimentalEnableAuthenticationTransfer: false,
                doPasswordReset: jest.fn(),
                doEmailReset: jest.fn(),
                doManageTeams: jest.fn(),
                doManageRoles: jest.fn(),
                doManageTokens: jest.fn(),
                isDisabled: false,
            },
        };

        const wrapper = renderWithIntl(
            <Provider store={store}>
                <UserList {...props}/>,
            </Provider>,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
