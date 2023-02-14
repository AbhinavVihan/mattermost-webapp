// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import AccessHistoryModal from "components/access_history_modal";
import ActivityLogModal from "components/activity_log_modal";
import LocalizedIcon from "components/localized_icon";
import ToggleModalButton from "components/toggle_modal_button";
import React, { useCallback, useState } from "react";
import {
    defineMessages,
    FormattedDate,
    FormattedMessage,
    FormattedTime,
} from "react-intl";
import { t } from "utils/i18n";

type setting = {
    hasError: boolean;
    errors: {
        clientError: string;
        serverError: string;
    };
    value: string | undefined;
};

export type PasswordSettings = {
    [key: string]:
        | {
              hasError?: boolean;
              errors?: {
                  clientError?: string;
                  serverError?: string;
              };
              value?: string;
          }
        | undefined;
    confirmNewPassword: setting;
    newPassword: setting;
    currentPassword: setting;
};

export const passwordTitle = {
    id: t("user.settings.security.password"),
    defaultMessage: "Password",
};

export const passwordDescription = (date: JSX.Element, time: JSX.Element) => {
    console.log(date, time);
    return {
        id: t("user.settings.security.passwordDescription"),
        defaultMessage: `Last updated ${{ date }} at ${{ time }}`,
    };
};

export const passw = (d: Date, militaryTime: boolean) => {
    return (
        <FormattedMessage
            id="user.settings.security.lastUpdated"
            defaultMessage="Last updated {date} at {time}"
            values={{
                date: (
                    <FormattedDate
                        value={d}
                        day="2-digit"
                        month="short"
                        year="numeric"
                    />
                ),
                time: (
                    <FormattedTime
                        value={d}
                        hour12={!militaryTime}
                        hour="2-digit"
                        minute="2-digit"
                    />
                ),
            }}
        />
    );
};

export const MfaTitle = {
    id: t("user.settings.security.MfaTitle"),
    defaultMessage: "Multi-factor authentication (MFA)",
};

export const MfaDescription = {
    id: t("user.settings.security.MfaDescription"),
    defaultMessage:
        "Adding multi-factor authentication will make your account more secure by requiring a code from your mobile device each time you sign in.",
};

export const AccessHistoryTitle = {
    id: t("user.settings.security.AccessHistoryTitle"),
    defaultMessage: "Access history",
};

export const AccessHistoryDesc = {
    id: t("user.settings.security.AccessHistoryDesc"),
    defaultMessage:
        "View a list of recent login and logout attempts, channel creations and deletions, account settings changes, or channel setting modifications made on your account.",
};

export const showAccessHistory = () => (
    <ToggleModalButton
        className="security_links"
        modalId="access_history"
        dialogType={AccessHistoryModal}
        id="viewAccessHistory"
    >
        <LocalizedIcon
            className="fa fa-clock-o"
            title={{
                id: t("user.settings.security.viewHistory.icon"),
                defaultMessage: "Access History Icon",
            }}
        />
        <FormattedMessage
            id="user.settings.security.viewHistory"
            defaultMessage="View Access History"
        />
    </ToggleModalButton>
);

export const ActiveSectionsTitle = {
    id: t("user.settings.security.ActiveSectionsTitle"),
    defaultMessage: "Active sessions",
};

export const ActiveSectionsDesc = {
    id: t("user.settings.security.ActiveSectionsDesc"),
    defaultMessage:
        "Sessions are created when you log in through a new browser on a device. You can view all active sessions and log out of any session you want to revoke.",
};
export const showActiveSections = () => (
    <ToggleModalButton
        className="security_links"
        modalId="activity_log"
        dialogType={ActivityLogModal}
        id="viewAndLogOutOfActiveSessions"
    >
        <LocalizedIcon
            className="fa fa-clock-o"
            title={{
                id: t("user.settings.security.logoutActiveSessions.icon"),
                defaultMessage: "Active Sessions Icon",
            }}
        />
        <FormattedMessage
            id="user.settings.security.ActiveSessions"
            defaultMessage="View Active Sessions"
        />
    </ToggleModalButton>
);
