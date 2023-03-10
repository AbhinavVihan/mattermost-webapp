// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import {fireEvent, screen} from '@testing-library/react';

import {Provider} from 'react-redux';

import {renderWithIntl} from 'tests/react_testing_utils';
import store from 'stores/redux_store';

import AutocompleteSelector from './autocomplete_selector';

describe('components/widgets/settings/AutocompleteSelector', () => {
    test('render component with required props', () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    id='string.id'
                    label='some label'
                    value='some value'
                    providers={[]}
                />
            </Provider>,
        );
        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="form-group"
                    data-testid="autoCompleteSelector"
                  >
                    <label
                      class="control-label "
                    >
                      some label
                    </label>
                    <div
                      class=""
                    >
                      <div
                        class="select-suggestion-container"
                      >
                        <div
                          aria-live="polite"
                          class="sr-only"
                          role="alert"
                        />
                        <div>
                          <input
                            autocomplete="off"
                            class="form-control"
                            data-testid="suggestionBox-input"
                            value="some value"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  ,
                </div>
              </body>,
              "container": <div>
                <div
                  class="form-group"
                  data-testid="autoCompleteSelector"
                >
                  <label
                    class="control-label "
                  >
                    some label
                  </label>
                  <div
                    class=""
                  >
                    <div
                      class="select-suggestion-container"
                    >
                      <div
                        aria-live="polite"
                        class="sr-only"
                        role="alert"
                      />
                      <div>
                        <input
                          autocomplete="off"
                          class="form-control"
                          data-testid="suggestionBox-input"
                          value="some value"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                ,
              </div>,
              "debug": [Function],
              "findAllByAltText": [Function],
              "findAllByDisplayValue": [Function],
              "findAllByLabelText": [Function],
              "findAllByPlaceholderText": [Function],
              "findAllByRole": [Function],
              "findAllByTestId": [Function],
              "findAllByText": [Function],
              "findAllByTitle": [Function],
              "findByAltText": [Function],
              "findByDisplayValue": [Function],
              "findByLabelText": [Function],
              "findByPlaceholderText": [Function],
              "findByRole": [Function],
              "findByTestId": [Function],
              "findByText": [Function],
              "findByTitle": [Function],
              "getAllByAltText": [Function],
              "getAllByDisplayValue": [Function],
              "getAllByLabelText": [Function],
              "getAllByPlaceholderText": [Function],
              "getAllByRole": [Function],
              "getAllByTestId": [Function],
              "getAllByText": [Function],
              "getAllByTitle": [Function],
              "getByAltText": [Function],
              "getByDisplayValue": [Function],
              "getByLabelText": [Function],
              "getByPlaceholderText": [Function],
              "getByRole": [Function],
              "getByTestId": [Function],
              "getByText": [Function],
              "getByTitle": [Function],
              "queryAllByAltText": [Function],
              "queryAllByDisplayValue": [Function],
              "queryAllByLabelText": [Function],
              "queryAllByPlaceholderText": [Function],
              "queryAllByRole": [Function],
              "queryAllByTestId": [Function],
              "queryAllByText": [Function],
              "queryAllByTitle": [Function],
              "queryByAltText": [Function],
              "queryByDisplayValue": [Function],
              "queryByLabelText": [Function],
              "queryByPlaceholderText": [Function],
              "queryByRole": [Function],
              "queryByTestId": [Function],
              "queryByText": [Function],
              "queryByTitle": [Function],
              "rerender": [Function],
              "unmount": [Function],
            }
        `);
    });

    test('check snapshot with value prop and changing focus', () => {
        const wrapper = renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    providers={[]}
                    label='some label'
                    value='value from prop'
                />
            </Provider>,
        );

        const inputNode = screen.getByTestId('suggestionBox-input');
        fireEvent.focusOut(inputNode);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="form-group"
                    data-testid="autoCompleteSelector"
                  >
                    <label
                      class="control-label "
                    >
                      some label
                    </label>
                    <div
                      class=""
                    >
                      <div
                        class="select-suggestion-container"
                      >
                        <div
                          aria-live="polite"
                          class="sr-only"
                          role="alert"
                        />
                        <div>
                          <input
                            autocomplete="off"
                            class="form-control"
                            data-testid="suggestionBox-input"
                            value="value from prop"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  ,
                </div>
              </body>,
              "container": <div>
                <div
                  class="form-group"
                  data-testid="autoCompleteSelector"
                >
                  <label
                    class="control-label "
                  >
                    some label
                  </label>
                  <div
                    class=""
                  >
                    <div
                      class="select-suggestion-container"
                    >
                      <div
                        aria-live="polite"
                        class="sr-only"
                        role="alert"
                      />
                      <div>
                        <input
                          autocomplete="off"
                          class="form-control"
                          data-testid="suggestionBox-input"
                          value="value from prop"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                ,
              </div>,
              "debug": [Function],
              "findAllByAltText": [Function],
              "findAllByDisplayValue": [Function],
              "findAllByLabelText": [Function],
              "findAllByPlaceholderText": [Function],
              "findAllByRole": [Function],
              "findAllByTestId": [Function],
              "findAllByText": [Function],
              "findAllByTitle": [Function],
              "findByAltText": [Function],
              "findByDisplayValue": [Function],
              "findByLabelText": [Function],
              "findByPlaceholderText": [Function],
              "findByRole": [Function],
              "findByTestId": [Function],
              "findByText": [Function],
              "findByTitle": [Function],
              "getAllByAltText": [Function],
              "getAllByDisplayValue": [Function],
              "getAllByLabelText": [Function],
              "getAllByPlaceholderText": [Function],
              "getAllByRole": [Function],
              "getAllByTestId": [Function],
              "getAllByText": [Function],
              "getAllByTitle": [Function],
              "getByAltText": [Function],
              "getByDisplayValue": [Function],
              "getByLabelText": [Function],
              "getByPlaceholderText": [Function],
              "getByRole": [Function],
              "getByTestId": [Function],
              "getByText": [Function],
              "getByTitle": [Function],
              "queryAllByAltText": [Function],
              "queryAllByDisplayValue": [Function],
              "queryAllByLabelText": [Function],
              "queryAllByPlaceholderText": [Function],
              "queryAllByRole": [Function],
              "queryAllByTestId": [Function],
              "queryAllByText": [Function],
              "queryAllByTitle": [Function],
              "queryByAltText": [Function],
              "queryByDisplayValue": [Function],
              "queryByLabelText": [Function],
              "queryByPlaceholderText": [Function],
              "queryByRole": [Function],
              "queryByTestId": [Function],
              "queryByText": [Function],
              "queryByTitle": [Function],
              "rerender": [Function],
              "unmount": [Function],
            }
        `);

        fireEvent.change(inputNode, {target: {value: 'value from input'}});

        fireEvent.focus(inputNode);

        expect(wrapper).toMatchInlineSnapshot(`
            Object {
              "asFragment": [Function],
              "baseElement": <body>
                <div>
                  <div
                    class="form-group"
                    data-testid="autoCompleteSelector"
                  >
                    <label
                      class="control-label "
                    >
                      some label
                    </label>
                    <div
                      class=""
                    >
                      <div
                        class="select-suggestion-container"
                      >
                        <div
                          aria-live="polite"
                          class="sr-only"
                          role="alert"
                        />
                        <div>
                          <input
                            autocomplete="off"
                            class="form-control"
                            data-testid="suggestionBox-input"
                            value=""
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  ,
                </div>
              </body>,
              "container": <div>
                <div
                  class="form-group"
                  data-testid="autoCompleteSelector"
                >
                  <label
                    class="control-label "
                  >
                    some label
                  </label>
                  <div
                    class=""
                  >
                    <div
                      class="select-suggestion-container"
                    >
                      <div
                        aria-live="polite"
                        class="sr-only"
                        role="alert"
                      />
                      <div>
                        <input
                          autocomplete="off"
                          class="form-control"
                          data-testid="suggestionBox-input"
                          value=""
                        />
                      </div>
                    </div>
                  </div>
                </div>
                ,
              </div>,
              "debug": [Function],
              "findAllByAltText": [Function],
              "findAllByDisplayValue": [Function],
              "findAllByLabelText": [Function],
              "findAllByPlaceholderText": [Function],
              "findAllByRole": [Function],
              "findAllByTestId": [Function],
              "findAllByText": [Function],
              "findAllByTitle": [Function],
              "findByAltText": [Function],
              "findByDisplayValue": [Function],
              "findByLabelText": [Function],
              "findByPlaceholderText": [Function],
              "findByRole": [Function],
              "findByTestId": [Function],
              "findByText": [Function],
              "findByTitle": [Function],
              "getAllByAltText": [Function],
              "getAllByDisplayValue": [Function],
              "getAllByLabelText": [Function],
              "getAllByPlaceholderText": [Function],
              "getAllByRole": [Function],
              "getAllByTestId": [Function],
              "getAllByText": [Function],
              "getAllByTitle": [Function],
              "getByAltText": [Function],
              "getByDisplayValue": [Function],
              "getByLabelText": [Function],
              "getByPlaceholderText": [Function],
              "getByRole": [Function],
              "getByTestId": [Function],
              "getByText": [Function],
              "getByTitle": [Function],
              "queryAllByAltText": [Function],
              "queryAllByDisplayValue": [Function],
              "queryAllByLabelText": [Function],
              "queryAllByPlaceholderText": [Function],
              "queryAllByRole": [Function],
              "queryAllByTestId": [Function],
              "queryAllByText": [Function],
              "queryAllByTitle": [Function],
              "queryByAltText": [Function],
              "queryByDisplayValue": [Function],
              "queryByLabelText": [Function],
              "queryByPlaceholderText": [Function],
              "queryByRole": [Function],
              "queryByTestId": [Function],
              "queryByText": [Function],
              "queryByTitle": [Function],
              "rerender": [Function],
              "unmount": [Function],
            }
        `);
    });

    test('onSelected', () => {
        const onSelected = jest.fn();
        const selected = {text: 'sometext', value: 'somevalue'};
        renderWithIntl(
            <Provider store={store}>
                <AutocompleteSelector
                    label='some label'
                    value='some value'
                    providers={[]}
                    onSelected={onSelected}
                />
            </Provider>,
        );

        onSelected(selected);

        expect(onSelected).toHaveBeenCalledTimes(1);
        expect(onSelected).toHaveBeenCalledWith(selected);
    });
});
