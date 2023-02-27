// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import { UserProfile } from "@mattermost/types/users";
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
import { Link } from "react-router-dom";
import Constants from "utils/constants";
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

export const showSwitchButtons = (user: UserProfile, props: any) => {
    let emailOption;
    let gitlabOption;
    let googleOption;
    let office365Option;
    let openidOption;
    let ldapOption;
    let samlOption;
    if (user.auth_service === "") {
        if (props.enableSignUpWithGitLab) {
            gitlabOption = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_oauth?email=" +
                            encodeURIComponent(user.email) +
                            "&old_type=" +
                            user.auth_service +
                            "&new_type=" +
                            Constants.GITLAB_SERVICE
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchGitlab"
                            defaultMessage="Switch to Using GitLab SSO"
                        />
                    </Link>
                    <br />
                </div>
            );
        }

        if (props.enableSignUpWithGoogle) {
            googleOption = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_oauth?email=" +
                            encodeURIComponent(user.email) +
                            "&old_type=" +
                            user.auth_service +
                            "&new_type=" +
                            Constants.GOOGLE_SERVICE
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchGoogle"
                            defaultMessage="Switch to Using Google SSO"
                        />
                    </Link>
                    <br />
                </div>
            );
        }

        if (props.enableSignUpWithOffice365) {
            office365Option = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_oauth?email=" +
                            encodeURIComponent(user.email) +
                            "&old_type=" +
                            user.auth_service +
                            "&new_type=" +
                            Constants.OFFICE365_SERVICE
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchOffice365"
                            defaultMessage="Switch to Using Office 365 SSO"
                        />
                    </Link>
                    <br />
                </div>
            );
        }

        if (props.enableSignUpWithOpenId) {
            openidOption = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_oauth?email=" +
                            encodeURIComponent(user.email) +
                            "&old_type=" +
                            user.auth_service +
                            "&new_type=" +
                            Constants.OPENID_SERVICE
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchOpenId"
                            defaultMessage="Switch to Using OpenID SSO"
                        />
                    </Link>
                    <br />
                </div>
            );
        }

        if (props.enableLdap) {
            ldapOption = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_ldap?email=" +
                            encodeURIComponent(user.email)
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchLdap"
                            defaultMessage="Switch to Using AD/LDAP"
                        />
                    </Link>
                    <br />
                </div>
            );
        }

        if (props.enableSaml) {
            samlOption = (
                <div className="pb-3">
                    <Link
                        className="style--none security_links"
                        to={
                            "/claim/email_to_oauth?email=" +
                            encodeURIComponent(user.email) +
                            "&old_type=" +
                            user.auth_service +
                            "&new_type=" +
                            Constants.SAML_SERVICE
                        }
                    >
                        <FormattedMessage
                            id="user.settings.security.switchSaml"
                            defaultMessage="Switch to Using SAML SSO"
                        />
                    </Link>
                    <br />
                </div>
            );
        } else if (props.enableSignUpWithEmail) {
            let link;
            if (user.auth_service === Constants.LDAP_SERVICE) {
                link =
                    "/claim/ldap_to_email?email=" +
                    encodeURIComponent(user.email);
            } else {
                link =
                    "/claim/oauth_to_email?email=" +
                    encodeURIComponent(user.email) +
                    "&old_type=" +
                    user.auth_service;
            }

            emailOption = (
                <div className="pb-3">
                    <Link className="style--none security_links" to={link}>
                        <FormattedMessage
                            id="user.settings.security.switchEmail"
                            defaultMessage="Switch to Using Email and Password"
                        />
                    </Link>
                    <br />
                </div>
            );
        }
    }
    return (
        <div>
            {emailOption}
            {gitlabOption}
            {googleOption}
            {office365Option}
            {openidOption}
            {ldapOption}
            {samlOption}
        </div>
    );
};

export const signInMethodTitle = {
    id: t("user.settings.security.signIn"),
    defaultMessage: "Sign-in method",
};

export const signInDesc = {
    id: "user.settings.security.signInDesc",
    defaultMessage:
        "You may only have one sign-in method at a time. Switching your sign-in method will send an email notifying you if the change was successful.",
};

export const renderMFAContent = (
    mfaActive: boolean,
    mfaEnforced: boolean,
    removeMfa: (e: React.MouseEvent<HTMLElement>) => Promise<void>,
    setupMfa: (e: React.MouseEvent<HTMLElement>) => void
) => {
    let content;

    if (mfaActive) {
        let buttonText;

        if (mfaEnforced) {
            buttonText = (
                <FormattedMessage
                    id="user.settings.mfa.reset"
                    defaultMessage="Reset MFA on Account"
                />
            );
        } else {
            buttonText = (
                <FormattedMessage
                    id="user.settings.mfa.remove"
                    defaultMessage="Remove MFA from Account"
                />
            );
        }

        content = (
            <a
                className="style--none security_links"
                href="#"
                onClick={removeMfa}
            >
                {buttonText}
            </a>
        );
    } else {
        content = (
            <a
                className="style--none security_links"
                href="#"
                onClick={setupMfa}
            >
                <FormattedMessage
                    id="user.settings.mfa.add"
                    defaultMessage="Add MFA to Account"
                />
            </a>
        );
    }

    return (
        <div className="pt-2">
            {content}
            <br />
        </div>
    );
};
