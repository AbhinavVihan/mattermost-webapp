// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { AlertOutlineIcon } from "@mattermost/compass-icons/components";
import React, { useState } from "react";
import "./fieldset_item_creator.scss";

type Props = {
    title: string;
    value: string | undefined;
    borderClass: "border__gray" | "border__blue";
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    errors?: {
        clientError?: string;
        serverError?: string;
        emailError?: string;
    };
    classNames?: string;
    isPassword?: boolean;
    isDisabled?: boolean;
};

function FieldsetItemCreator({
    title,
    value,
    classNames,
    onChange,
    errors,
    borderClass,
    isPassword,
    isDisabled,
}: Props): JSX.Element {
    const [isFocused, setIsfocused] = useState(false);
    return (
        <div className={classNames}>
            <fieldset
                className={`${isFocused && borderClass} ${
                    isDisabled && " isDisabled "
                } ${
                    (errors?.clientError ||
                        errors?.serverError ||
                        errors?.emailError) &&
                    " mm-fieldset-error"
                }`}
            >
                <legend
                    className={
                        (errors?.clientError ||
                            errors?.serverError ||
                            errors?.emailError) &&
                        "mm-fieldset-error"
                    }
                >
                    {title}
                </legend>
                <input
                    className="mm-fieldset-input"
                    value={value}
                    type={isPassword && isPassword ? "password" : "text"}
                    onChange={onChange}
                    onFocus={() => setIsfocused(true)}
                    onBlur={() => setIsfocused(false)}
                    disabled={isDisabled && isDisabled}
                />
            </fieldset>
            <span className="error-span">
                {(errors?.clientError || errors?.serverError) && (
                    <AlertOutlineIcon size={14} />
                )}
                {errors?.clientError}
                {errors?.serverError}
                {errors?.emailError}
            </span>
        </div>
    );
}

export default FieldsetItemCreator;
