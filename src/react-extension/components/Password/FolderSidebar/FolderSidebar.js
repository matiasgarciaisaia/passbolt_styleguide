/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.13.0
 */
import React from "react";
import Icon from "../../../../react/components/Common/Icons/Icon";
import PropTypes from "prop-types";
import FolderSidebarInformationSection from "./FolderSidebarInformationSection";
import FolderSidebarPermissionsSection from "./FolderSidebarPermissionsSection";
import FolderSidebarActivitySection from "./FolderSidebarActivitySection";
import AppContext from "../../../contexts/AppContext";
import {withResourceWorkspace} from "../../../contexts/ResourceWorkspaceContext";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import {withTranslation} from "react-i18next";

class FolderSidebar extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.bindCallbacks();
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handlePermalinkClick = this.handlePermalinkClick.bind(this);
  }

  /**
   * Handle when the user closes the sidebar.
   */
  handleCloseClick() {
    this.props.resourceWorkspaceContext.onLockDetail();
  }

  /**
   * Handle when the user copies the permalink.
   */
  async handlePermalinkClick() {
    const baseUrl = this.context.userSettings.getTrustedDomain();
    const permalink = `${baseUrl}/app/folders/view/${this.props.resourceWorkspaceContext.details.folder.id}`;
    await this.context.port.request("passbolt.clipboard.copy", permalink);
    this.props.actionFeedbackContext.displaySuccess(this.translate("The permalink has been copied to clipboard"));
  }

  /**
   * Get the translate function
   * @returns {function(...[*]=)}
   */
  get translate() {
    return this.props.t;
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <div className="panel aside ready">
        <div className="sidebar resource">
          <div className="sidebar-header">
            <div className="teaser-image">
              <Icon name="folder"/>
            </div>
            <h3>
              <div className="title-wrapper">
                <span className="name">{this.props.resourceWorkspaceContext.details.folder.name}</span>
                <a className="title-link" title={this.translate("Copy the link to this folder")} onClick={this.handlePermalinkClick}>
                  <Icon name="link"/>
                  <span className="visuallyhidden">Copy the link to this folder</span>
                </a>
              </div>
              <span className="subtitle">{this.translate("folder")}</span>
            </h3>
            <a className="dialog-close" onClick={this.handleCloseClick}>
              <Icon name="close"/>
              <span className="visuallyhidden">Close</span>
            </a>
          </div>
          <FolderSidebarInformationSection/>
          <FolderSidebarPermissionsSection/>
          <FolderSidebarActivitySection/>
        </div>
      </div>
    );
  }
}

FolderSidebar.contextType = AppContext;

FolderSidebar.propTypes = {
  groups: PropTypes.array,
  onSelectFolderParent: PropTypes.func,
  onSelectRoot: PropTypes.func,
  onEditPermissions: PropTypes.func,
  users: PropTypes.array,
  resourceWorkspaceContext: PropTypes.object,
  actionFeedbackContext: PropTypes.any, // The action feedback context
  t: PropTypes.func, // The translation function
};

export default withResourceWorkspace(withActionFeedback(withTranslation('common')(FolderSidebar)));
