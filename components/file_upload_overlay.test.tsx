// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import FileUploadOverlay from 'components/file_upload_overlay';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/FileUploadOverlay', () => {
    test('should match snapshot when file upload is showing with no overlay type', () => {
        const wrapper = renderWithIntl(
            <FileUploadOverlay
                overlayType=''
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot when file upload is showing with overlay type of right', () => {
        const wrapper = renderWithIntl(
            <FileUploadOverlay
                overlayType='right'
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot when file upload is showing with overlay type of center', () => {
        const wrapper = renderWithIntl(
            <FileUploadOverlay
                overlayType='center'
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
