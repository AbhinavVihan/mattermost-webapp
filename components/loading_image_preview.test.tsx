// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {screen} from '@testing-library/react';

import LoadingImagePreview from 'components/loading_image_preview';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/LoadingImagePreview', () => {
    test('should match snapshot', () => {
        const loading = 'Loading';
        const progress = 50;

        const wrapper = renderWithIntl(
            <LoadingImagePreview
                loading={loading}
                progress={progress}
            />,
        );

        expect(wrapper).toMatchSnapshot();
        expect(screen.getByTestId('loader-percent').textContent).toBe('Loading 50%');

        expect(wrapper).toMatchSnapshot();
    });

    test('should set the loading percent to 90', () => {
        const loading = 'Loading';
        const progress = 90;
        const wrapper = renderWithIntl(
            <LoadingImagePreview
                loading={loading}
                progress={progress}
            />,
        );

        expect(screen.getByTestId('loader-percent').textContent).toBe('Loading 90%');

        expect(wrapper).toMatchSnapshot();
    });
});
