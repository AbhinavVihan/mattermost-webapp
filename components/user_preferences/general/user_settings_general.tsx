// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

/* eslint-disable max-lines */

import React, { useCallback, useState } from "react";
import {
    defineMessages,
    FormattedDate,
    FormattedMessage,
    injectIntl,
    IntlShape,
} from "react-intl";

import SettingItemMax from "components/setting_item_max";

import { isEmail } from "mattermost-redux/utils/helpers";

import { trackEvent } from "actions/telemetry_actions.jsx";
import * as Utils from "utils/utils";
import { t } from "utils/i18n";

import LocalizedIcon from "components/localized_icon";
import SettingPicture from "components/setting_picture";
import LoadingWrapper from "components/widgets/loading/loading_wrapper";
import {
    AnnouncementBarMessages,
    AnnouncementBarTypes,
    AcceptedProfileImageTypes,
    Constants,
    ValidationErrors,
} from "utils/constants";

import { UserProfile } from "@mattermost/types/users";
import SettingItem from "components/setting_item";
import FieldsetItemCreator from "components/widgets/modals/genric/filedset_item_creator";
import { holders, Settings, yourInfo } from "./utils";
import SaveChangesPanel from "components/widgets/modals/genric/save_changes_panel";
import SectionCreator from "components/widgets/modals/genric/section_creator";

export type Props = {
    intl: IntlShape;
    user: UserProfile;
    updateSection: (section: string) => void;
    updateTab: (notifications: string) => void;
    activeSection?: string;
    closeModal: () => void;
    collapseModal: () => void;
    maxFileSize: number;
    actions: {
        logError: (
            { message, type }: { message: any; type: string },
            status: boolean
        ) => void;
        clearErrors: () => void;
        updateMe: (user: UserProfile) => Promise<{
            data: boolean;
            error?: {
                server_error_id: string;
                message: string;
            };
        }>;
        sendVerificationEmail: (email: string) => Promise<{
            data: boolean;
            error?: {
                err: string;
            };
        }>;
        setDefaultProfileImage: (id: string) => void;
        uploadProfileImage: (
            id: string,
            file: File
        ) => Promise<{
            data: boolean;
            error?: {
                message: string;
            };
        }>;
    };
    requireEmailVerification?: boolean;
    ldapFirstNameAttributeSet?: boolean;
    ldapLastNameAttributeSet?: boolean;
    samlFirstNameAttributeSet?: boolean;
    samlLastNameAttributeSet?: boolean;
    ldapNicknameAttributeSet?: boolean;
    samlNicknameAttributeSet?: boolean;
    ldapPositionAttributeSet?: boolean;
    samlPositionAttributeSet?: boolean;
    ldapPictureAttributeSet?: boolean;
};

type State = {
    username: string;
    firstName: string;
    lastName: string;
    nickname: string;
    position: string;
    originalEmail: string;
    email: string;
    confirmEmail: string;
    currentPassword: string;
    pictureFile: File | null;
    loadingPicture: boolean;
    sectionIsSaving: boolean;
    showSpinner: boolean;
    resendStatus?: string;
    clientError?: string | null;
    serverError?: string | { server_error_id: string; message: string };
    emailError?: string;
};

// eslint-disable-next-line react/require-optimization
export class UserSettingsGeneralTab extends React.Component<Props, State> {
    public submitActive = false;

    constructor(props: Props) {
        super(props);

        this.state = this.setupInitialState(props);
    }

    handleEmailResend = (email: string) => {
        this.setState({ resendStatus: "sending", showSpinner: true });
        this.props.actions
            .sendVerificationEmail(email)
            .then(({ data, error: err }) => {
                if (data) {
                    this.setState({ resendStatus: "success" });
                } else if (err) {
                    this.setState({ resendStatus: "failure" });
                }
            });
    };

    createEmailResendLink = (email: string) => {
        return (
            <span className="resend-verification-wrapper">
                <LoadingWrapper
                    loading={this.state.showSpinner}
                    text={Utils.localizeMessage(
                        "user.settings.general.sending",
                        "Sending"
                    )}
                >
                    <a
                        onClick={() => {
                            this.handleEmailResend(email);
                            setTimeout(() => {
                                this.setState({
                                    showSpinner: false,
                                });
                            }, 500);
                        }}
                    >
                        <FormattedMessage
                            id="user.settings.general.sendAgain"
                            defaultMessage="Send again"
                        />
                    </a>
                </LoadingWrapper>
            </span>
        );
    };

    submitUsername = () => {
        const user = Object.assign({}, this.props.user);
        const username = this.state.username.trim().toLowerCase();

        const { formatMessage } = this.props.intl;
        const usernameError = Utils.isValidUsername(username);
        if (usernameError) {
            let errObj;
            if (usernameError.id === ValidationErrors.RESERVED_NAME) {
                errObj = {
                    clientError: formatMessage(holders.usernameReserved),
                    serverError: "",
                };
            } else {
                errObj = {
                    clientError: formatMessage(holders.usernameRestrictions, {
                        min: Constants.MIN_USERNAME_LENGTH,
                        max: Constants.MAX_USERNAME_LENGTH,
                    }),
                    serverError: "",
                };
            }
            this.setState(errObj);
            return;
        }

        if (user.username === username) {
            this.updateSection("");
            return;
        }

        user.username = username;

        trackEvent("settings", "user_settings_update", { field: "username" });

        this.submitUser(user, false);
    };

    submitNickname = () => {
        const user = Object.assign({}, this.props.user);
        const nickname = this.state.nickname.trim();

        if (user.nickname === nickname) {
            this.updateSection("");
            return;
        }

        user.nickname = nickname;

        trackEvent("settings", "user_settings_update", { field: "nickname" });

        this.submitUser(user, false);
    };

    submitName = () => {
        const user = Object.assign({}, this.props.user);
        const firstName = this.state.firstName.trim();
        const lastName = this.state.lastName.trim();

        if (user.first_name === firstName && user.last_name === lastName) {
            this.updateSection("");
            return;
        }

        user.first_name = firstName;
        user.last_name = lastName;

        trackEvent("settings", "user_settings_update", { field: "fullname" });

        this.submitUser(user, false);
    };

    submitEmail = () => {
        const user = Object.assign({}, this.props.user);
        const email = this.state.email.trim().toLowerCase();
        const confirmEmail = this.state.confirmEmail.trim().toLowerCase();
        const currentPassword = this.state.currentPassword;

        const { formatMessage } = this.props.intl;

        if (
            email === user.email &&
            (confirmEmail === "" || confirmEmail === user.email)
        ) {
            this.updateSection("");
            return;
        }

        if (email === "" || !isEmail(email)) {
            this.setState({
                emailError: formatMessage(holders.validEmail),
                clientError: "",
                serverError: "",
            });
            return;
        }

        if (email !== confirmEmail) {
            this.setState({
                emailError: formatMessage(holders.emailMatch),
                clientError: "",
                serverError: "",
            });
            return;
        }

        if (currentPassword === "") {
            this.setState({
                emailError: formatMessage(holders.emptyPassword),
                clientError: "",
                serverError: "",
            });
            return;
        }

        user.email = email;
        user.password = currentPassword;
        trackEvent("settings", "user_settings_update", { field: "email" });
        this.submitUser(user, true);
    };

    submitUser = (user: UserProfile, emailUpdated: boolean) => {
        const { formatMessage } = this.props.intl;
        this.setState({ sectionIsSaving: true });

        this.props.actions.updateMe(user).then(({ data, error: err }) => {
            if (data) {
                this.updateSection("");

                const verificationEnabled =
                    this.props.requireEmailVerification && emailUpdated;
                if (verificationEnabled) {
                    this.props.actions.clearErrors();
                    this.props.actions.logError(
                        {
                            message:
                                AnnouncementBarMessages.EMAIL_VERIFICATION_REQUIRED,
                            type: AnnouncementBarTypes.SUCCESS,
                        },
                        true
                    );
                }
            } else if (err) {
                let serverError;
                if (
                    err.server_error_id &&
                    err.server_error_id ===
                        "api.user.check_user_password.invalid.app_error"
                ) {
                    serverError = formatMessage(holders.incorrectPassword);
                } else if (
                    err.server_error_id === "app.user.group_name_conflict"
                ) {
                    serverError = formatMessage(
                        holders.usernameGroupNameUniqueness
                    );
                } else if (err.message) {
                    serverError = err.message;
                } else {
                    serverError = err;
                }
                this.setState({
                    serverError,
                    emailError: "",
                    clientError: "",
                    sectionIsSaving: false,
                });
            }
        });
    };

    setDefaultProfilePicture = async () => {
        try {
            await this.props.actions.setDefaultProfileImage(this.props.user.id);
            this.updateSection("");
            this.submitActive = false;
        } catch (err) {
            let serverError;
            if (err.message) {
                serverError = err.message;
            } else {
                serverError = err;
            }
            this.setState({
                serverError,
                emailError: "",
                clientError: "",
                sectionIsSaving: false,
            });
        }
    };

    submitPicture = () => {
        if (!this.state.pictureFile) {
            return;
        }

        if (!this.submitActive) {
            return;
        }

        trackEvent("settings", "user_settings_update", { field: "picture" });

        const { formatMessage } = this.props.intl;
        const file = this.state.pictureFile;

        if (!AcceptedProfileImageTypes.includes(file.type)) {
            this.setState({
                clientError: formatMessage(holders.validImage),
                serverError: "",
            });
            return;
        } else if (file.size > this.props.maxFileSize) {
            this.setState({
                clientError: formatMessage(holders.imageTooLarge),
                serverError: "",
            });
            return;
        }

        this.setState({ loadingPicture: true });

        this.props.actions
            .uploadProfileImage(this.props.user.id, file)
            .then(({ data, error: err }) => {
                if (data) {
                    this.updateSection("");
                    this.submitActive = false;
                } else if (err) {
                    const state = this.setupInitialState(this.props);
                    state.serverError = err.message;
                    this.setState(state);
                }
            });
    };

    submitPosition = () => {
        const user = Object.assign({}, this.props.user);
        const position = this.state.position.trim();

        if (user.position === position) {
            this.updateSection("");
            return;
        }

        user.position = position;

        trackEvent("settings", "user_settings_update", { field: "position" });

        this.submitUser(user, false);
    };

    updateUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ username: e.target.value });
    };

    updateFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ firstName: e.target.value });
    };

    updateLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ lastName: e.target.value });
    };

    updateNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ nickname: e.target.value });
    };

    updatePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ position: e.target.value });
    };

    updateEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: e.target.value });
    };

    updateConfirmEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ confirmEmail: e.target.value });
    };

    updateCurrentPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ currentPassword: e.target.value });
    };

    updatePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            this.setState({ pictureFile: e.target.files[0] });

            this.submitActive = true;
            this.setState({ clientError: null });
        } else {
            this.setState({ pictureFile: null });
        }
    };

    updateSection = (section: string) => {
        this.setState(
            Object.assign({}, this.setupInitialState(this.props), {
                clientError: "",
                serverError: "",
                emailError: "",
                sectionIsSaving: false,
            })
        );
        this.submitActive = false;
        this.props.updateSection(section);
    };

    setupInitialState(props: Props) {
        const user = props.user;

        return {
            username: user.username,
            firstName: user.first_name,
            lastName: user.last_name,
            nickname: user.nickname,
            position: user.position,
            originalEmail: user.email,
            email: "",
            confirmEmail: "",
            currentPassword: "",
            pictureFile: null,
            loadingPicture: false,
            sectionIsSaving: false,
            showSpinner: false,
            serverError: "",
        };
    }

    createEmailSection() {
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "email";
        let max = null;
        if (active) {
            const emailVerificationEnabled =
                this.props.requireEmailVerification;
            const inputs = [];

            let helpText = (
                <FormattedMessage
                    id="user.settings.general.emailHelp1"
                    defaultMessage="Email is used for sign-in, notifications, and password reset. Email requires verification if changed."
                />
            );

            if (!emailVerificationEnabled) {
                helpText = (
                    <FormattedMessage
                        id="user.settings.general.emailHelp3"
                        defaultMessage="Email is used for sign-in, notifications, and password reset."
                    />
                );
            }

            let submit = null;

            if (this.props.user.auth_service === "") {
                inputs.push(
                    <div key="currentEmailSetting">
                        <div className="form-group">
                            <label className="col-sm-5 control-label">
                                <FormattedMessage
                                    id="user.settings.general.currentEmail"
                                    defaultMessage="Current Email"
                                />
                            </label>
                            <div className="col-sm-7">
                                <label className="control-label word-break--all text-left">
                                    {this.state.originalEmail}
                                </label>
                            </div>
                        </div>
                    </div>
                );

                inputs.push(
                    <div key="emailSetting">
                        <div className="form-group">
                            <label className="col-sm-5 control-label">
                                <FormattedMessage
                                    id="user.settings.general.newEmail"
                                    defaultMessage="New Email"
                                />
                            </label>
                            <div className="col-sm-7">
                                <input
                                    autoFocus={true}
                                    id="primaryEmail"
                                    className="form-control"
                                    type="email"
                                    onChange={this.updateEmail}
                                    maxLength={Constants.MAX_EMAIL_LENGTH}
                                    value={this.state.email}
                                    aria-label={formatMessage({
                                        id: "user.settings.general.newEmail",
                                        defaultMessage: "New Email",
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                );

                inputs.push(
                    <div key="confirmEmailSetting">
                        <div className="form-group">
                            <label className="col-sm-5 control-label">
                                <FormattedMessage
                                    id="user.settings.general.confirmEmail"
                                    defaultMessage="Confirm Email"
                                />
                            </label>
                            <div className="col-sm-7">
                                <input
                                    id="confirmEmail"
                                    className="form-control"
                                    type="email"
                                    onChange={this.updateConfirmEmail}
                                    maxLength={Constants.MAX_EMAIL_LENGTH}
                                    value={this.state.confirmEmail}
                                    aria-label={formatMessage({
                                        id: "user.settings.general.confirmEmail",
                                        defaultMessage: "Confirm Email",
                                    })}
                                />
                            </div>
                        </div>
                    </div>
                );

                inputs.push(
                    <div key="currentPassword">
                        <div className="form-group">
                            <label className="col-sm-5 control-label">
                                <FormattedMessage
                                    id="user.settings.general.currentPassword"
                                    defaultMessage="Current Password"
                                />
                            </label>
                            <div className="col-sm-7">
                                <input
                                    id="currentPassword"
                                    className="form-control"
                                    type="password"
                                    onChange={this.updateCurrentPassword}
                                    value={this.state.currentPassword}
                                    aria-label={formatMessage({
                                        id: "user.settings.general.currentPassword",
                                        defaultMessage: "Current Password",
                                    })}
                                />
                            </div>
                        </div>
                        {helpText}
                    </div>
                );

                submit = this.submitEmail;
            } else if (
                this.props.user.auth_service === Constants.GITLAB_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="form-group">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailGitlabCantUpdate"
                                defaultMessage="Login occurs through GitLab. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                        {helpText}
                    </div>
                );
            } else if (
                this.props.user.auth_service === Constants.GOOGLE_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="form-group">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailGoogleCantUpdate"
                                defaultMessage="Login occurs through Google Apps. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                        {helpText}
                    </div>
                );
            } else if (
                this.props.user.auth_service === Constants.OFFICE365_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="form-group">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailOffice365CantUpdate"
                                defaultMessage="Login occurs through Office 365. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                        {helpText}
                    </div>
                );
            } else if (
                this.props.user.auth_service === Constants.OPENID_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="form-group">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailOpenIdCantUpdate"
                                defaultMessage="Login occurs through OpenID Connect. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                        {helpText}
                    </div>
                );
            } else if (
                this.props.user.auth_service === Constants.LDAP_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="pb-2">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailLdapCantUpdate"
                                defaultMessage="Login occurs through AD/LDAP. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                    </div>
                );
            } else if (
                this.props.user.auth_service === Constants.SAML_SERVICE
            ) {
                inputs.push(
                    <div key="oauthEmailInfo" className="pb-2">
                        <div className="setting-list__hint pb-3">
                            <FormattedMessage
                                id="user.settings.general.emailSamlCantUpdate"
                                defaultMessage="Login occurs through SAML. Email cannot be updated. Email address used for notifications is {email}."
                                values={{
                                    email: this.state.originalEmail,
                                }}
                            />
                        </div>
                        {helpText}
                    </div>
                );
            }

            max = (
                <SettingItemMax
                    title={
                        <FormattedMessage
                            id="user.settings.general.email"
                            defaultMessage="Email"
                        />
                    }
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.sectionIsSaving}
                    serverError={this.state.serverError}
                    clientError={this.state.emailError}
                    updateSection={this.updateSection}
                />
            );
        }

        let describe: JSX.Element | string = "";
        if (this.props.user.auth_service === "") {
            describe = this.props.user.email;
        } else if (this.props.user.auth_service === Constants.GITLAB_SERVICE) {
            describe = (
                <FormattedMessage
                    id="user.settings.general.loginGitlab"
                    defaultMessage="Login done through GitLab ({email})"
                    values={{
                        email: this.state.originalEmail,
                    }}
                />
            );
        } else if (this.props.user.auth_service === Constants.GOOGLE_SERVICE) {
            describe = (
                <FormattedMessage
                    id="user.settings.general.loginGoogle"
                    defaultMessage="Login done through Google Apps ({email})"
                    values={{
                        email: this.state.originalEmail,
                    }}
                />
            );
        } else if (
            this.props.user.auth_service === Constants.OFFICE365_SERVICE
        ) {
            describe = (
                <FormattedMessage
                    id="user.settings.general.loginOffice365"
                    defaultMessage="Login done through Office 365 ({email})"
                    values={{
                        email: this.state.originalEmail,
                    }}
                />
            );
        } else if (this.props.user.auth_service === Constants.LDAP_SERVICE) {
            describe = (
                <FormattedMessage
                    id="user.settings.general.loginLdap"
                    defaultMessage="Login done through AD/LDAP ({email})"
                    values={{
                        email: this.state.originalEmail,
                    }}
                />
            );
        } else if (this.props.user.auth_service === Constants.SAML_SERVICE) {
            describe = (
                <FormattedMessage
                    id="user.settings.general.loginSaml"
                    defaultMessage="Login done through SAML ({email})"
                    values={{
                        email: this.state.originalEmail,
                    }}
                />
            );
        }

        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={
                    <FormattedMessage
                        id="user.settings.general.email"
                        defaultMessage="Email"
                    />
                }
                describe={describe}
                section={"email"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    }

    createNameSection = () => {
        const user = this.props.user;
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "name";
        let max = null;
        if (active) {
            const inputs = [];

            let extraInfo;
            let submit = null;
            if (
                (this.props.user.auth_service === Constants.LDAP_SERVICE &&
                    (this.props.ldapFirstNameAttributeSet ||
                        this.props.ldapLastNameAttributeSet)) ||
                (this.props.user.auth_service === Constants.SAML_SERVICE &&
                    (this.props.samlFirstNameAttributeSet ||
                        this.props.samlLastNameAttributeSet)) ||
                Constants.OAUTH_SERVICES.includes(this.props.user.auth_service)
            ) {
                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.field_handled_externally"
                            defaultMessage="This field is handled through your login provider. If you want to change it, you need to do so through your login provider."
                        />
                    </span>
                );
            } else {
                inputs.push(
                    <div key="firstNameSetting" className="form-group">
                        <label className="col-sm-5 control-label">
                            <FormattedMessage
                                id="user.settings.general.firstName"
                                defaultMessage="First Name"
                            />
                        </label>
                        <div className="col-sm-7">
                            <input
                                id="firstName"
                                autoFocus={true}
                                className="form-control"
                                type="text"
                                onChange={this.updateFirstName}
                                maxLength={Constants.MAX_FIRSTNAME_LENGTH}
                                value={this.state.firstName}
                                onFocus={Utils.moveCursorToEnd}
                                aria-label={formatMessage({
                                    id: "user.settings.general.firstName",
                                    defaultMessage: "First Name",
                                })}
                            />
                        </div>
                    </div>
                );

                inputs.push(
                    <div key="lastNameSetting" className="form-group">
                        <label className="col-sm-5 control-label">
                            <FormattedMessage
                                id="user.settings.general.lastName"
                                defaultMessage="Last Name"
                            />
                        </label>
                        <div className="col-sm-7">
                            <input
                                id="lastName"
                                className="form-control"
                                type="text"
                                onChange={this.updateLastName}
                                maxLength={Constants.MAX_LASTNAME_LENGTH}
                                value={this.state.lastName}
                                aria-label={formatMessage({
                                    id: "user.settings.general.lastName",
                                    defaultMessage: "Last Name",
                                })}
                            />
                        </div>
                    </div>
                );

                const notifClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
                    e.preventDefault();
                    this.updateSection("");
                    this.props.updateTab("notifications");
                };

                const notifLink = (
                    <a href="#" onClick={notifClick.bind(this)}>
                        <FormattedMessage
                            id="user.settings.general.notificationsLink"
                            defaultMessage="Notifications"
                        />
                    </a>
                );

                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.notificationsExtra"
                            defaultMessage="By default, you will receive mention notifications when someone types your first name. Go to {notify} settings to change this default."
                            values={{
                                notify: notifLink,
                            }}
                        />
                    </span>
                );

                submit = this.submitName;
            }

            max = (
                <SettingItemMax
                    title={formatMessage(holders.fullName)}
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.sectionIsSaving}
                    serverError={this.state.serverError}
                    clientError={this.state.clientError}
                    updateSection={this.updateSection}
                    extraInfo={extraInfo}
                />
            );
        }

        let describe: JSX.Element | string = "";

        if (user.first_name && user.last_name) {
            describe = user.first_name + " " + user.last_name;
        } else if (user.first_name) {
            describe = user.first_name;
        } else if (user.last_name) {
            describe = user.last_name;
        } else {
            describe = (
                <FormattedMessage
                    id="user.settings.general.emptyName"
                    defaultMessage="Click 'Edit' to add your full name"
                />
            );
            if (Utils.isMobile()) {
                describe = (
                    <FormattedMessage
                        id="user.settings.general.mobile.emptyName"
                        defaultMessage="Click to add your full name"
                    />
                );
            }
        }

        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={formatMessage(holders.fullName)}
                describe={describe}
                section={"name"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    };

    createNicknameSection = () => {
        const user = this.props.user;
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "nickname";
        let max = null;
        if (active) {
            const inputs = [];

            let extraInfo;
            let submit = null;
            if (
                (this.props.user.auth_service === "ldap" &&
                    this.props.ldapNicknameAttributeSet) ||
                (this.props.user.auth_service === Constants.SAML_SERVICE &&
                    this.props.samlNicknameAttributeSet)
            ) {
                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.field_handled_externally"
                            defaultMessage="This field is handled through your login provider. If you want to change it, you need to do so through your login provider."
                        />
                    </span>
                );
            } else {
                let nicknameLabel: JSX.Element | string = (
                    <FormattedMessage
                        id="user.settings.general.nickname"
                        defaultMessage="Nickname"
                    />
                );
                if (Utils.isMobile()) {
                    nicknameLabel = "";
                }

                inputs.push(
                    <div key="nicknameSetting" className="form-group">
                        <label className="col-sm-5 control-label">
                            {nicknameLabel}
                        </label>
                        <div className="col-sm-7">
                            <input
                                id="nickname"
                                autoFocus={true}
                                className="form-control"
                                type="text"
                                onChange={this.updateNickname}
                                value={this.state.nickname}
                                maxLength={Constants.MAX_NICKNAME_LENGTH}
                                autoCapitalize="off"
                                aria-label={formatMessage({
                                    id: "user.settings.general.nickname",
                                    defaultMessage: "Nickname",
                                })}
                            />
                        </div>
                    </div>
                );

                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.nicknameExtra"
                            defaultMessage="Use Nickname for a name you might be called that is different from your first name and username. This is most often used when two or more people have similar sounding names and usernames."
                        />
                    </span>
                );

                submit = this.submitNickname;
            }

            max = (
                <SettingItemMax
                    title={formatMessage(holders.nickname)}
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.sectionIsSaving}
                    serverError={this.state.serverError}
                    clientError={this.state.clientError}
                    updateSection={this.updateSection}
                    extraInfo={extraInfo}
                />
            );
        }

        let describe: JSX.Element | string = "";
        if (user.nickname) {
            describe = user.nickname;
        } else {
            describe = (
                <FormattedMessage
                    id="user.settings.general.emptyNickname"
                    defaultMessage="Click 'Edit' to add a nickname"
                />
            );
            if (Utils.isMobile()) {
                describe = (
                    <FormattedMessage
                        id="user.settings.general.mobile.emptyNickname"
                        defaultMessage="Click to add a nickname"
                    />
                );
            }
        }

        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={formatMessage(holders.nickname)}
                describe={describe}
                section={"nickname"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    };

    createUsernameSection = () => {
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "username";
        let max = null;
        if (active) {
            const inputs = [];

            let extraInfo;
            let submit = null;
            if (this.props.user.auth_service === "") {
                let usernameLabel: JSX.Element | string = (
                    <FormattedMessage
                        id="user.settings.general.username"
                        defaultMessage="Username"
                    />
                );
                if (Utils.isMobile()) {
                    usernameLabel = "";
                }

                inputs.push(
                    <div key="usernameSetting" className="form-group">
                        <label className="col-sm-5 control-label">
                            {usernameLabel}
                        </label>
                        <div className="col-sm-7">
                            <input
                                id="username"
                                autoFocus={true}
                                maxLength={Constants.MAX_USERNAME_LENGTH}
                                className="form-control"
                                type="text"
                                onChange={this.updateUsername}
                                value={this.state.username}
                                autoCapitalize="off"
                                onFocus={Utils.moveCursorToEnd}
                                aria-label={formatMessage({
                                    id: "user.settings.general.username",
                                    defaultMessage: "Username",
                                })}
                            />
                        </div>
                    </div>
                );

                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.usernameInfo"
                            defaultMessage="Pick something easy for teammates to recognize and recall."
                        />
                    </span>
                );

                submit = this.submitUsername;
            } else {
                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.field_handled_externally"
                            defaultMessage="This field is handled through your login provider. If you want to change it, you need to do so through your login provider."
                        />
                    </span>
                );
            }

            max = (
                <SettingItemMax
                    title={formatMessage(holders.username)}
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.sectionIsSaving}
                    serverError={this.state.serverError}
                    clientError={this.state.clientError}
                    updateSection={this.updateSection}
                    extraInfo={extraInfo}
                />
            );
        }
        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={formatMessage(holders.username)}
                describe={this.props.user.username}
                section={"username"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    };

    createPositionSection = () => {
        const user = this.props.user;
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "position";
        let max = null;
        if (active) {
            const inputs = [];

            let extraInfo: JSX.Element | string;
            let submit = null;
            if (
                (this.props.user.auth_service === Constants.LDAP_SERVICE &&
                    this.props.ldapPositionAttributeSet) ||
                (this.props.user.auth_service === Constants.SAML_SERVICE &&
                    this.props.samlPositionAttributeSet)
            ) {
                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.field_handled_externally"
                            defaultMessage="This field is handled through your login provider. If you want to change it, you need to do so through your login provider."
                        />
                    </span>
                );
            } else {
                let positionLabel: JSX.Element | string = (
                    <FormattedMessage
                        id="user.settings.general.position"
                        defaultMessage="Position"
                    />
                );
                if (Utils.isMobile()) {
                    positionLabel = "";
                }

                inputs.push(
                    <div key="positionSetting" className="form-group">
                        <label className="col-sm-5 control-label">
                            {positionLabel}
                        </label>
                        <div className="col-sm-7">
                            <input
                                id="position"
                                autoFocus={true}
                                className="form-control"
                                type="text"
                                onChange={this.updatePosition}
                                value={this.state.position}
                                maxLength={Constants.MAX_POSITION_LENGTH}
                                autoCapitalize="off"
                                onFocus={Utils.moveCursorToEnd}
                                aria-label={formatMessage({
                                    id: "user.settings.general.position",
                                    defaultMessage: "Position",
                                })}
                            />
                        </div>
                    </div>
                );

                extraInfo = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.positionExtra"
                            defaultMessage="Use Position for your role or job title. This will be shown in your profile popover."
                        />
                    </span>
                );

                submit = this.submitPosition;
            }

            max = (
                <SettingItemMax
                    title={formatMessage(holders.position)}
                    inputs={inputs}
                    submit={submit}
                    saving={this.state.sectionIsSaving}
                    serverError={this.state.serverError}
                    clientError={this.state.clientError}
                    updateSection={this.updateSection}
                    extraInfo={extraInfo}
                />
            );
        }

        let describe: JSX.Element | string = "";
        if (user.position) {
            describe = user.position;
        } else {
            describe = (
                <FormattedMessage
                    id="user.settings.general.emptyPosition"
                    defaultMessage="Click 'Edit' to add your job title / position"
                />
            );
            if (Utils.isMobile()) {
                describe = (
                    <FormattedMessage
                        id="user.settings.general.mobile.emptyPosition"
                        defaultMessage="Click to add your job title / position"
                    />
                );
            }
        }

        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={formatMessage(holders.position)}
                describe={describe}
                section={"position"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    };

    createPictureSection = () => {
        const user = this.props.user;
        const { formatMessage } = this.props.intl;

        const active = this.props.activeSection === "picture";
        let max = null;

        if (active) {
            let submit = null;
            let setDefault = null;
            let helpText = null;
            let imgSrc = null;

            if (
                (this.props.user.auth_service === Constants.LDAP_SERVICE ||
                    this.props.user.auth_service === Constants.SAML_SERVICE) &&
                this.props.ldapPictureAttributeSet
            ) {
                helpText = (
                    <span>
                        <FormattedMessage
                            id="user.settings.general.field_handled_externally"
                            defaultMessage="This field is handled through your login provider. If you want to change it, you need to do so through your login provider."
                        />
                    </span>
                );
            } else {
                submit = this.submitPicture;
                setDefault =
                    user.last_picture_update > 0
                        ? this.setDefaultProfilePicture
                        : null;
                imgSrc = Utils.imageURLForUser(
                    user.id,
                    user.last_picture_update
                );
                helpText = (
                    <>
                        <FormattedMessage
                            id={"setting_picture.help.profile"}
                            defaultMessage="Upload a picture in BMP, JPG, JPEG, or PNG format."
                        />
                        <FormattedMessage
                            id={"setting_picture.help.profile.maxFileSize"}
                            defaultMessage="Maximum file size: {max}"
                            values={{
                                max: Utils.fileSizeToString(
                                    this.props.maxFileSize
                                ),
                            }}
                        />
                    </>
                );
            }

            max = (
                <SettingPicture
                    title={formatMessage(holders.profilePicture)}
                    onSubmit={submit}
                    onSetDefault={setDefault}
                    src={imgSrc}
                    defaultImageSrc={Utils.defaultImageURLForUser(user.id)}
                    serverError={this.state.serverError}
                    clientError={this.state.clientError}
                    updateSection={(e: React.MouseEvent) => {
                        this.updateSection("");
                        e.preventDefault();
                    }}
                    file={this.state.pictureFile}
                    onFileChange={this.updatePicture}
                    submitActive={this.submitActive}
                    loadingPicture={this.state.loadingPicture}
                    maxFileSize={this.props.maxFileSize}
                    helpText={helpText}
                />
            );
        }

        let minMessage: JSX.Element | string = formatMessage(
            holders.uploadImage
        );
        if (Utils.isMobile()) {
            minMessage = formatMessage(holders.uploadImageMobile);
        }
        if (user.last_picture_update) {
            minMessage = (
                <FormattedMessage
                    id="user.settings.general.imageUpdated"
                    defaultMessage="Image last updated {date}"
                    values={{
                        date: (
                            <FormattedDate
                                value={new Date(user.last_picture_update)}
                                day="2-digit"
                                month="short"
                                year="numeric"
                            />
                        ),
                    }}
                />
            );
        }
        return (
            <SettingItem
                active={active}
                areAllSectionsInactive={this.props.activeSection === ""}
                title={formatMessage(holders.profilePicture)}
                describe={minMessage}
                section={"picture"}
                updateSection={this.updateSection}
                max={max}
            />
        );
    };

    render() {
        const { formatMessage } = this.props.intl;

        const nameSection = this.createNameSection();
        const nicknameSection = this.createNicknameSection();
        const usernameSection = this.createUsernameSection();
        const positionSection = this.createPositionSection();
        const emailSection = this.createEmailSection();
        const pictureSection = this.createPictureSection();

        return (
            <div id="generalSettings">
                <fieldset>
                    <legend>Wash Your Hands</legend>
                    <input style={{ border: "1px solid black" }} />
                </fieldset>

                <div className="modal-header">
                    <button
                        id="closeUserSettings"
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label={formatMessage(holders.close)}
                        onClick={this.props.closeModal}
                    >
                        <span aria-hidden="true">{"×"}</span>
                    </button>
                    <h4 className="modal-title">
                        <div className="modal-back">
                            <LocalizedIcon
                                className="fa fa-angle-left"
                                title={{
                                    id: t("generic_icons.collapse"),
                                    defaultMessage: "Collapse Icon",
                                }}
                                onClick={this.props.collapseModal}
                            />
                        </div>
                        <FormattedMessage
                            id="user.settings.modal.profile"
                            defaultMessage="Profile"
                        />
                    </h4>
                </div>
                <div className="user-settings">
                    <h3 id="generalSettingsTitle" className="tab-header">
                        <FormattedMessage
                            id="user.settings.modal.profile"
                            defaultMessage="Profile"
                        />
                    </h3>
                    <div className="divider-dark first" />
                    {nameSection}
                    <div className="divider-light" />
                    {usernameSection}
                    <div className="divider-light" />
                    {nicknameSection}
                    <div className="divider-light" />
                    {positionSection}
                    <div className="divider-light" />
                    {emailSection}
                    <div className="divider-light" />
                    {pictureSection}
                    <div className="divider-dark" />
                </div>
            </div>
        );
    }
}

// export default injectIntl(UserSettingsGeneralTab);

export const UserSettingsInfoTab = (props: Props): JSX.Element => {
    const { username, first_name, last_name, nickname, position, email } =
        props.user;
    console.log(props);
    const initialState = (value: string, isDisabled?: boolean) => ({
        hasError: false,
        errors: {
            clientError: "",
            serverError: "",
        },
        value,
        isDisabled,
    });
    const isFisrtnameDisabled =
        (props.user.auth_service === Constants.LDAP_SERVICE &&
            (props.ldapFirstNameAttributeSet ||
                props.ldapLastNameAttributeSet)) ||
        (props.user.auth_service === Constants.SAML_SERVICE &&
            (props.samlFirstNameAttributeSet ||
                props.samlLastNameAttributeSet)) ||
        Constants.OAUTH_SERVICES.includes(props.user.auth_service);

    const isNickNameDisabled =
        (props.user.auth_service === "ldap" &&
            props.ldapNicknameAttributeSet) ||
        (props.user.auth_service === Constants.SAML_SERVICE &&
            props.samlNicknameAttributeSet);

    const isPositionDisabled =
        (props.user.auth_service === Constants.LDAP_SERVICE &&
            props.ldapPositionAttributeSet) ||
        (props.user.auth_service === Constants.SAML_SERVICE &&
            props.samlPositionAttributeSet);

    const [settings, setSettings] = useState<Settings>({
        username: initialState(username, props.user.auth_service !== ""),
        fullName: initialState(
            first_name + " " + last_name,
            isFisrtnameDisabled
        ),
        nickname: initialState(nickname, isNickNameDisabled),
        position: initialState(position, isPositionDisabled),
        email: {
            hasError: false,
            errors: {
                emailError: "",
                clientError: "",
                serverError: "",
            },
            value: email,
            isDisabled: false,
        },
        currentPassword: { ...initialState(""), isPassword: true },
    });

    const [pictureFile, setPictureFile] = useState<{
        value: File | null;
        clientError: string;
        serverError: string;
        loadingPicture: boolean;
    }>({
        value: null,
        clientError: "",
        serverError: "",
        loadingPicture: false,
    });

    const [haveChanges, setHaveChanges] = useState(false);
    const handleChange = useCallback(
        (values: { key: string; value: string }) => {
            setSettings({
                ...settings,
                [values.key]: {
                    ...settings[values.key],
                    value: values.value,
                },
            });
            setHaveChanges(true);
        },
        [settings]
    );

    console.log(settings);

    function restoreDefaults() {
        setSettings({
            username: initialState(username),
            fullName: initialState(first_name + " " + last_name),
            nickname: initialState(nickname),
            position: initialState(position),
            email: {
                hasError: false,
                errors: {
                    emailError: "",
                    clientError: "",
                    serverError: "",
                },
                value: email,
            },
            currentPassword: initialState(""),
        });
        setPictureFile({ ...pictureFile, value: null });
        setHaveChanges(false);
    }

    const handleSubmit = () => {
        let shouldSubmit = true;
        const user = { ...props.user };
        const { formatMessage } = props.intl;
        const email = settings.email.value?.trim().toLowerCase();

        const currentPassword = settings.currentPassword.value;
        const Username = settings.username.value?.trim().toLowerCase();
        const usernameError = Utils.isValidUsername(Username as string);
        const position = settings.position.value?.trim();

        let errObj = {
            clientError: "",
            serverError: "",
        };
        if (usernameError) {
            shouldSubmit = false;
            if (usernameError.id === ValidationErrors.RESERVED_NAME) {
                errObj = {
                    clientError: formatMessage(holders.usernameReserved),
                    serverError: "",
                };
            } else {
                shouldSubmit = false;
                errObj = {
                    clientError: formatMessage(holders.usernameRestrictions, {
                        min: Constants.MIN_USERNAME_LENGTH,
                        max: Constants.MAX_USERNAME_LENGTH,
                    }),
                    serverError: "",
                };
            }
        }
        if (usernameError === undefined) {
            user.username = Username as string;
        }

        trackEvent("settings", "user_settings_update", {
            field: "username",
        });
        const nickname = settings.nickname.value?.trim();

        user.nickname = nickname as string;

        trackEvent("settings", "user_settings_update", {
            field: "nickname",
        });
        user.first_name = settings.fullName.value
            ?.split(" ")[0]
            .trim() as string;
        user.last_name = settings.fullName.value
            ?.split(" ")[1]
            .trim() as string;

        trackEvent("settings", "user_settings_update", {
            field: "fullname",
        });

        user.position = position as string;

        trackEvent("settings", "user_settings_update", {
            field: "position",
        });

        let hasEmailError = false;
        let emailError = "";

        if (email === "" || !isEmail(email as string)) {
            shouldSubmit = false;
            hasEmailError = true;
            emailError = formatMessage(holders.validEmail);
        }
        // let hasConfirmEmailError = false;
        // let confirmEmailError = "";
        // if (email !== confirmEmail) {
        //     shouldSubmit = false;
        //     hasConfirmEmailError = true;
        //     confirmEmailError = formatMessage(holders.emailMatch);
        // }
        let hasCurrPassworsErr = false;
        let currPasswordErr = "";
        if (settings.email.value !== props.user.email) {
            if (currentPassword === "") {
                shouldSubmit = false;
                hasCurrPassworsErr = true;
                currPasswordErr = formatMessage(holders.emptyPassword);
            } else {
                user.password = currentPassword as string;
            }
        }

        user.email = email as string;
        trackEvent("settings", "user_settings_update", {
            field: "email",
        });

        setSettings({
            ...settings,
            username: {
                ...settings.username,
                errors: { ...errObj, emailError: "" },
                hasError: usernameError !== undefined,
                value: Username,
            },
            nickname: {
                ...settings.nickname,
                value: nickname,
            },
            position: {
                ...settings.position,
                value: position,
            },
            fullName: {
                ...settings.fullName,
                value: user.first_name + " " + user.last_name,
            },
            email: {
                ...settings.email,
                hasError: hasEmailError,
                errors: { ...settings.email.errors, emailError },
                value: email,
            },
            currentPassword: {
                ...settings.currentPassword,
                hasError: hasCurrPassworsErr,
                errors: {
                    ...settings.currentPassword.errors,
                    clientError: currPasswordErr,
                },
            },
        });
        console.log("shouldSubmit", shouldSubmit);
        shouldSubmit && props.actions.updateMe(user);
        submitPicture();
        setHaveChanges(false);
    };

    console.log(props.user);

    const submitPicture = useCallback(() => {
        if (!pictureFile.value) {
            return;
        }

        trackEvent("settings", "user_settings_update", { field: "picture" });

        const { formatMessage } = props.intl;
        const file = pictureFile;

        if (
            file.value &&
            !AcceptedProfileImageTypes.includes(file.value.type)
        ) {
            setPictureFile({
                ...pictureFile,
                clientError: formatMessage(holders.validImage),
            });
            return;
        } else if (file.value && file.value.size > props.maxFileSize) {
            setPictureFile({
                ...pictureFile,
                clientError: formatMessage(holders.imageTooLarge),
            });
            return;
        }

        setPictureFile({ ...pictureFile, loadingPicture: true });

        props.actions
            .uploadProfileImage(props.user.id, file.value!)
            .then(({ data, error: err }) => {
                if (data) {
                } else if (err) {
                    setPictureFile({
                        ...pictureFile,
                        serverError: err.message,
                    });
                    setPictureFile({ ...pictureFile, loadingPicture: false });
                }
            });
    }, [pictureFile.value]);

    const setDefaultProfilePicture = async () => {
        try {
            await props.actions.setDefaultProfileImage(props.user.id);
        } catch (err) {
            let serverError;
            if (err.message) {
                serverError = err.message;
            } else {
                serverError = err;
            }
            setPictureFile({ ...pictureFile, serverError });
        }
    };

    const updatePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            console.log(e.target.files[0]);
            setPictureFile({ ...pictureFile, value: e.target.files[0] });
            setHaveChanges(true);
        } else {
            setPictureFile({ ...pictureFile, value: null });
        }
    };
    const { formatMessage } = props.intl;
    const isPictureDisabled =
        (props.user.auth_service === Constants.LDAP_SERVICE ||
            props.user.auth_service === Constants.SAML_SERVICE) &&
        props.ldapPictureAttributeSet;
    console.log(isPictureDisabled);
    const setDefault =
        props.user.last_picture_update > 0 ? setDefaultProfilePicture : null;

    const helpText = (
        <FormattedMessage
            id={"setting_picture.help.profile"}
            defaultMessage="Upload a picture in BMP, JPG, JPEG, or PNG format. Maximum file size: {max}"
            values={{
                max: Utils.fileSizeToString(props.maxFileSize),
            }}
        />
    );

    return (
        <div style={{ display: "flex" }}>
            <div>
                <SectionCreator title={yourInfo} />
                {Object.keys(settings).map((setting) => (
                    <>
                        <FieldsetItemCreator
                            isPassword={settings[setting]?.isPassword ?? false}
                            title={setting}
                            value={settings[setting]?.value}
                            onChange={(e) =>
                                handleChange({
                                    key: setting,
                                    value: e.target.value,
                                })
                            }
                            errors={settings[setting]?.errors}
                            classNames="mm-fieldset"
                            borderClass="border__blue"
                            isDisabled={settings[setting]?.isDisabled}
                        />
                    </>
                ))}
            </div>
            {!isPictureDisabled && (
                <SettingPicture
                    title={formatMessage(holders.profilePicture)}
                    onSubmit={submitPicture}
                    onSetDefault={setDefault}
                    src={Utils.imageURLForUser(
                        props.user.id,
                        props.user.last_picture_update
                    )}
                    defaultImageSrc={Utils.defaultImageURLForUser(
                        props.user.id
                    )}
                    serverError={pictureFile.serverError}
                    clientError={pictureFile.clientError}
                    updateSection={(e: React.MouseEvent) => {
                        e.preventDefault();
                    }}
                    file={pictureFile.value}
                    onFileChange={updatePicture}
                    submitActive={true}
                    loadingPicture={pictureFile.loadingPicture}
                    maxFileSize={props.maxFileSize}
                    helpText={helpText}
                />
            )}
            {haveChanges && (
                <SaveChangesPanel
                    handleSubmit={handleSubmit}
                    handleCancel={restoreDefaults}
                />
            )}
        </div>
    );
};

export default injectIntl(UserSettingsInfoTab);
