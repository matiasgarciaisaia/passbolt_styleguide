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
import React, {Fragment} from "react";
import Icon from "../../../../react/components/Common/Icons/Icon";
import AppContext from "../../../contexts/AppContext";
import PropTypes from "prop-types";
import {withRouter} from "react-router-dom";
import {withUserWorkspace} from "../../../contexts/UserWorkspaceContext";
import {withContextualMenu} from "../../../../react/contexts/Common/ContextualMenuContext";
import DisplayGroupsFilterContextualMenu from "./DisplayGroupsFilterContextualMenu";

/**
 * This component display groups to filter the users
 */
class DisplayGroups extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindCallbacks();
  }

  /**
   * Get default state
   * @returns {*}
   */
  get defaultState() {
    return {
      open: true, // open the group section
      title: "All groups", // title of the section
      filterType: null // type of the filter selected
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleTitleClickEvent = this.handleTitleClickEvent.bind(this);
    this.handleTitleMoreClickEvent = this.handleTitleMoreClickEvent.bind(this);
    this.handleTitleContextualMenuEvent = this.handleTitleContextualMenuEvent.bind(this);
    this.handleFilterGroupType = this.handleFilterGroupType.bind(this);
  }

  /**
   * Handle when the user click on the title.
   */
  handleTitleClickEvent() {
    const open = !this.state.open;
    this.setState({open});
  }

  /**
   * Handle when the user requests to display the contextual menu on the groups title.
   * @param {ReactEvent} event The event
   */
  handleTitleContextualMenuEvent(event) {
    // Prevent the browser contextual menu to pop up.
    event.preventDefault();
    this.showContextualMenu(event.pageY, event.pageX);
  }

  /**
   * Handle when the user requests to display the contextual menu on the groups title section.
   * @param {ReactEvent} event The event
   */
  handleTitleMoreClickEvent(event) {
    this.showContextualMenu(event.pageY, event.pageX);
  }

  /**
   * Show the contextual menu
   * @param {int} left The left position to display the menu
   * @param {int} top The top position to display the menu
   */
  showContextualMenu(top, left) {
    const onFilterSelected = this.handleFilterGroupType;
    const contextualMenuProps = {left, onFilterSelected, top};
    this.props.contextualMenuContext.show(DisplayGroupsFilterContextualMenu, contextualMenuProps);
  }

  /**
   * Handle when the user wants to filter tags
   * @param {string} filterType
   */
  handleFilterGroupType(filterType) {
    this.setState({filterType}, () => {
      this.updateTitle();
    });
  }

  // Zero conditional statements
  /**
   * get the title
   * @returns {{manage: string, default: string, member: string}}
   */
  get titles() {
    return {
      [filterByGroupsOptions.manage]: "Groups I manage",
      [filterByGroupsOptions.member]: "Groups I am member of",
      default: "All groups"
    };
  }

  /**
   * update the title of the filter tag
   */
  updateTitle() {
    const title = this.titles[this.state.filterType] || this.titles.default;
    this.setState({title});
  }

  // Zero conditional statements
  /**
   * get the filter according to the type of the filter
   * @returns {{manage: (function(*): *), all: (function(*): *), member: (function(*): *)}}
   */
  get filters() {
    return {
      [filterByGroupsOptions.manage]: group => group.my_group_user && group.my_group_user.is_admin,
      [filterByGroupsOptions.member]: group => group.my_group_user && !group.my_group_user.is_admin,
      [filterByGroupsOptions.all]: group => group
    };
  }

  /**
   * filter tag to display only the type selected
   * @returns {*[filtered tags]}
   */
  get filteredGroups() {
    const filterType = this.state.filterType || filterByGroupsOptions.all;
    const filter = this.filters[filterType];
    return this.groupsSorted.filter(filter);
  }

  /**
   * check if component loading
   * @returns {boolean}
   */
  isLoading() {
    return this.groups === null;
  }

  /**
   * has at least one group
   * @returns {*|boolean}
   */
  hasGroup() {
    return this.filteredGroups.length > 0;
  }

  /**
   * get groups
   * @returns {*}
   */
  get groups() {
    return this.context.groups;
  }

  /**
   * get groups sorted
   * @returns {*|boolean}
   */
  get groupsSorted() {
    return this.groups.sort((groupA, groupB) => groupA.name.localeCompare(groupB.name));
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <div className="folders navigation first accordion">
        <ul className="accordion-header">
          <li className={`node root ${this.state.open ? "open" : "close"}`}>
            <div className="row title">
              <div className="main-cell-wrapper">
                <div className="main-cell">
                  <h3>
                    <span className="folders-label" onClick={this.handleTitleClickEvent}>
                      <Fragment>
                        {this.state.open &&
                        <Icon name="caret-down"/>
                        }
                        {!this.state.open &&
                        <Icon name="caret-right"/>
                        }
                      </Fragment>
                      <span onContextMenu={this.handleTitleContextualMenuEvent}>{this.state.title}</span>
                    </span>
                  </h3>
                </div>
              </div>
              <div className="right-cell more-ctrl">
                <a className="filter" onClick={this.handleTitleMoreClickEvent}><Icon name="filter"/></a>
              </div>
            </div>
          </li>
        </ul>
        {this.state.open &&
        <div className="accordion-content">
          {this.isLoading() &&
          <div className="processing-wrapper">
            <span className="processing-text">Retrieving groups</span>
          </div>
          }
          {!this.isLoading() && !this.hasGroup() &&
          <em className="empty-content">empty</em>
          }
          {!this.isLoading() && this.hasGroup() &&
          <ul className="tree ready">
            {this.filteredGroups.map(group =>
              <li className="node root group-item" key={group.id}>
                <div className="row">
                  <div className="main-cell-wrapper">
                    <div className="main-cell">
                      <a title={group.name}><span className="ellipsis">{group.name}</span></a>
                    </div>
                  </div>
                </div>
              </li>
            )
            }
          </ul>
          }
        </div>
        }
      </div>
    );
  }
}

DisplayGroups.contextType = AppContext;

DisplayGroups.propTypes = {
  userWorkspaceContext: PropTypes.any, // user workspace context
  history: PropTypes.object,
  contextualMenuContext: PropTypes.any, // The contextual menu context
};

export default withRouter(withUserWorkspace(withContextualMenu(DisplayGroups)));

export const filterByGroupsOptions = {
  all: "all",
  manage: "manage",
  member: "member"
};
