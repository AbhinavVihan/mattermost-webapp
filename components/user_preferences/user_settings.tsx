// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from "react";

import { UserProfile } from "@mattermost/types/users";

import SidebarTab from "./sidebar";
import UserSettingsInfoTab from "./general";
import UserPreferencesSecurityTab from "./security";

export type Props = {
    user: UserProfile;
    activeTab?: string;
    activeSection: string;
    updateSection: (section?: string) => void;
    updateTab: (notifications: string) => void;
    closeModal: () => void;
    collapseModal: () => void;
    setEnforceFocus: () => void;
    setRequireConfirm: () => void;
    isContentProductSettings: boolean;
};

export default class UserSettings extends React.PureComponent<Props> {
    render() {
        console.log(this.props.isContentProductSettings);
        console.log(this.props.activeTab);

        if (this.props.isContentProductSettings) {
            if (this.props.activeTab === "display") {
                return (
                    <div>
                        {/* <DisplayTab
                            user={this.props.user}
                            activeSection={this.props.activeSection}
                            updateSection={this.props.updateSection}
                            closeModal={this.props.closeModal}
                            collapseModal={this.props.collapseModal}
                            setEnforceFocus={this.props.setEnforceFocus}
                            setRequireConfirm={this.props.setRequireConfirm}
                        /> */}
                    </div>
                );
            } else if (this.props.activeTab === "sidebar") {
                return <SidebarTab />;
            }

            return <div />;
        } else {
            if (this.props.activeTab === "Info") {
                return (
                    <div>
                        <UserSettingsInfoTab
                            user={this.props.user}
                            activeSection={this.props.activeSection}
                            updateSection={this.props.updateSection}
                            updateTab={this.props.updateTab}
                            closeModal={this.props.closeModal}
                            collapseModal={this.props.collapseModal}
                        />
                    </div>
                );
            } else if (this.props.activeTab === "Security") {
                return (
                    <div>
                        <UserPreferencesSecurityTab
                            user={this.props.user}
                            activeSection={this.props.activeSection}
                            updateSection={this.props.updateSection}
                            closeModal={this.props.closeModal}
                            collapseModal={this.props.collapseModal}
                            setRequireConfirm={this.props.setRequireConfirm}
                        />
                    </div>
                );
            }
            return <div />;
        }
    }
}
