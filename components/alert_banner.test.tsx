// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {renderWithIntl} from 'tests/react_testing_utils';

import AlertBanner from './alert_banner';

describe('Components/AlertBanner', () => {
    test('should match snapshot', () => {
        const wrapper = renderWithIntl(
            <AlertBanner
                mode='info'
                message='message'
                title='title'
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot for app variant', () => {
        const wrapper = renderWithIntl(
            <AlertBanner
                mode='info'
                message='message'
                title='title'
                variant='app'
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot when icon disabled', () => {
        const wrapper = renderWithIntl(
            <AlertBanner
                hideIcon={true}
                mode='info'
                message='message'
                title='title'
                variant='app'
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should match snapshot when buttons are passed', () => {
        const wrapper = renderWithIntl(
            <AlertBanner
                hideIcon={true}
                mode='info'
                message='message'
                title='title'
                variant='app'
                actionButtonLeft={<div id='actionButtonLeft'/>}
                actionButtonRight={<div id='actionButtonRight'/>}
            />,
        );

        expect(wrapper).toMatchSnapshot();
    });
});
