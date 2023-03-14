// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import {shallow} from 'enzyme';
import React from 'react';

import GroupUsersRow from 'components/admin_console/group_settings/group_details/group_users_row';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/admin_console/group_settings/group_details/GroupUsersRow', () => {
    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <GroupUsersRow
                username='test'
                displayName='Test display name'
                email='test@test.com'
                userId='xxxxxxxxxxxxxxxxxxxxxxxxxx'
                lastPictureUpdate={0}
            />,
        );
        expect(wrapper).toMatchSnapshot();
    });
});
