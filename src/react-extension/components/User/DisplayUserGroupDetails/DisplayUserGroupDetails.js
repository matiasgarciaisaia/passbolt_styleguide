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
import Icon from "../../Common/Icons/Icon";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import {withUserWorkspace} from "../../../contexts/UserWorkspaceContext";
import DisplayUserGroupDetailsInformation
  from "../DisplayUserGroupDetailsInformation/DisplayUserGroupDetailsInformation";
import GroupAvatar from "../../Common/Avatar/GroupAvatar";
import DisplayUserGroupDetailsMembers from "../DisplayUserGroupDetailsMembers/DisplayUserGroupDetailsMembers";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";

/**
 * This component displays the details of a users group
 */
class DisplayUserGroupDetails extends React.Component {
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
    this.handlePermalinkClick = this.handlePermalinkClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
  }

  /**
   * Returns the current user
   */
  get group() {
    return this.props.userWorkspaceContext.details.group;
  }

  /**
   * Returns the base url
   */
  get baseUrl() {
    return this.context.userSettings.getTrustedDomain();
  }

  /**
   * Handle when the user copies the permalink.
   */
  async handlePermalinkClick() {
    const baseUrl = this.context.userSettings.getTrustedDomain();
    const permalink = `${baseUrl}/app/groups/view/${this.group.id}`;
    await this.context.port.request("passbolt.clipboard.copy", permalink);
    this.props.actionFeedbackContext.displaySuccess("The permalink has been copied to clipboard");
  }


  /**
   * Handle close sidebar click
   */
  handleCloseClick() {
    this.props.userWorkspaceContext.onDetailsLocked();
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <div className="panel aside ready">
        <div className="sidebar user">
          <div className="sidebar-header">
            <div className="logo">
              <GroupAvatar
                group={this.group}
                baseUrl={this.baseUrl}/>
            </div>
            <h3>
              <div className="title-wrapper">
                <span className="name sidebar-header-title">{this.group.name}</span>
                <a className="title-link" title="Copy the link to this group" onClick={this.handlePermalinkClick}>
                  <Icon name="link"/>
                  <span className="visuallyhidden">Copy the link to this group</span>
                </a>
              </div>
              <span className="subtitle">group</span>
            </h3>
            <a className="dialog-close" onClick={this.handleCloseClick}>
              <Icon name="close"/>
              <span className="visuallyhidden">Close</span>
            </a>
          </div>
        </div>
        <DisplayUserGroupDetailsInformation/>
        <DisplayUserGroupDetailsMembers/>
      </div>
    );
  }
}

DisplayUserGroupDetails.contextType = AppContext;

DisplayUserGroupDetails.propTypes = {
  actionFeedbackContext: PropTypes.any, // The action feedback context,
  userWorkspaceContext: PropTypes.any, // The user workspace context
};

export default withActionFeedback(withUserWorkspace(DisplayUserGroupDetails));
