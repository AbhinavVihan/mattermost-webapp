// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import PostDeletedModal from 'components/post_deleted_modal';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/ChannelInfoModal', () => {
    const baseProps = {
        onExited: jest.fn(),
    };

    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <PostDeletedModal {...baseProps}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
