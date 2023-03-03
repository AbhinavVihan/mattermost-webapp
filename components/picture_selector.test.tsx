// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import PictureSelector from 'components/picture_selector';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/picture_selector', () => {
    const baseProps = {
        name: 'picture_selector_test',
        onSelect: jest.fn(),
        onRemove: jest.fn(),
    };

    test('should match snapshot, no picture selected', () => {
        const wrapper = renderWithIntl(
            <PictureSelector {...baseProps}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, existing picture provided', () => {
        const props = {
            ...baseProps,
            src: 'http:///url.com/picture.jpg',
            defaultSrc: 'http:///url.com/default-picture.jpg',
        };

        const wrapper = renderWithIntl(
            <PictureSelector {...props}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot, default picture provided', () => {
        const props = {
            ...baseProps,
            defaultSrc: 'http:///url.com/default-picture.jpg',
        };

        const wrapper = renderWithIntl(
            <PictureSelector {...props}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
