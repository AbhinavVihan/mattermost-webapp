// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { InformationOutlineIcon } from "@mattermost/compass-icons/components";
import React from "react";
import { defineMessages, FormattedMessage } from "react-intl";
import { t } from "utils/i18n";

type setting = {
    hasError: boolean;
    errors: {
        emailError?: string;
        clientError: string;
        serverError: string;
    };
    value: string | undefined;
    isDisabled?: boolean;
    isPassword?: boolean;
};

export type Settings = {
    [key: string]: any;
    username: setting;
    // firstName: setting;
    // lastName: setting;
    fullName: setting;
    nickname: setting;
    position: setting;
    // originalEmail: setting;
    email: setting;
    // confirmEmail: setting;
    currentPassword: setting;
};

export const holders = defineMessages({
    usernameReserved: {
        id: t("user.settings.general.usernameReserved"),
        defaultMessage: "This username is reserved, please choose a new one.",
    },
    usernameGroupNameUniqueness: {
        id: t("user.settings.general.usernameGroupNameUniqueness"),
        defaultMessage: "This username conflicts with an existing group name.",
    },
    usernameRestrictions: {
        id: t("user.settings.general.usernameRestrictions"),
        defaultMessage:
            "Username must begin with a letter, and contain between {min} to {max} lowercase characters made up of numbers, letters, and the symbols '.', '-', and '_'.",
    },
    validEmail: {
        id: t("user.settings.general.validEmail"),
        defaultMessage: "Please enter a valid email address.",
    },
    emailMatch: {
        id: t("user.settings.general.emailMatch"),
        defaultMessage: "The new emails you entered do not match.",
    },
    incorrectPassword: {
        id: t("user.settings.general.incorrectPassword"),
        defaultMessage: "Your password is incorrect.",
    },
    emptyPassword: {
        id: t("user.settings.general.emptyPassword"),
        defaultMessage: "Please enter your current password.",
    },
    validImage: {
        id: t("user.settings.general.validImage"),
        defaultMessage:
            "Only BMP, JPG, JPEG, or PNG images may be used for profile pictures",
    },
    imageTooLarge: {
        id: t("user.settings.general.imageTooLarge"),
        defaultMessage: "Unable to upload profile image. File is too large.",
    },
    uploadImage: {
        id: t("user.settings.general.uploadImage"),
        defaultMessage: "Click 'Edit' to upload an image.",
    },
    uploadImageMobile: {
        id: t("user.settings.general.mobile.uploadImage"),
        defaultMessage: "Click to upload an image",
    },
    fullName: {
        id: t("user.settings.general.fullName"),
        defaultMessage: "Full Name",
    },
    nickname: {
        id: t("user.settings.general.nickname"),
        defaultMessage: "Nickname",
    },
    username: {
        id: t("user.settings.general.username"),
        defaultMessage: "Username",
    },
    profilePicture: {
        id: t("user.settings.general.profilePicture"),
        defaultMessage: "Profile Picture",
    },
    close: {
        id: t("user.settings.general.close"),
        defaultMessage: "Close",
    },
    position: {
        id: t("user.settings.general.position"),
        defaultMessage: "Position",
    },
});

export const yourInfo = {
    id: t("user.settings.general.yourInfo"),
    defaultMessage: "Your information",
};

export const serviceInfo = (service?: string) => {
    return (
        <div key="oauthEmailInfo" className="service-info">
            <div>
                <InformationOutlineIcon size={24} />
                <FormattedMessage
                    id="user.settings.general.serviceHandler"
                    defaultMessage={`Some fields below are handled by your ${service} account`}
                />
            </div>
            <div>
                <FormattedMessage
                    id="user.settings.general.serviceHandler.desc"
                    defaultMessage={`Changes to locked fields must be made in your ${service} account.`}
                />
            </div>
        </div>
    );
};
