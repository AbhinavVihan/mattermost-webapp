// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {screen} from '@testing-library/react';

import ProgressBar from 'components/progress_bar';
import {renderWithIntl} from 'tests/react_testing_utils';

describe('components/progress_bar', () => {
    test('should show no progress', () => {
        const props = {
            current: 0,
            total: 10,
        };
        renderWithIntl(
            <ProgressBar {...props}/>,
        );

        expect(screen.getByTestId('ProgressBar__progress').style.flexGrow).toEqual('0');
    });

    test('should show 50% progress', () => {
        const props = {
            current: 5,
            total: 10,
        };
        renderWithIntl(
            <ProgressBar {...props}/>,
        );

        expect(screen.getByTestId('ProgressBar__progress').style.flexGrow).toEqual('0.5');
    });

    test('should show full progress', () => {
        const props = {
            current: 7,
            total: 7,
        };
        renderWithIntl(
            <ProgressBar {...props}/>,
        );

        expect(screen.getByTestId('ProgressBar__progress').style.flexGrow).toEqual('1');
    });

    test('should have flex basis', () => {
        const props = {
            current: 0,
            total: 7,
            basePercentage: 10,
        };
        renderWithIntl(
            <ProgressBar {...props}/>,
        );

        expect(screen.getByTestId('ProgressBar__progress').style.flexBasis).toEqual('10%');
    });
});
