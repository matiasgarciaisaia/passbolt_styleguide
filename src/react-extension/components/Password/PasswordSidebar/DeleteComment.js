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
import AppContext from "../../../contexts/AppContext";
import Icon from "../../Common/Icons/Icon";
import PropTypes from "prop-types";
import {withDialog} from "../../../contexts/Common/DialogContext";
import ConfirmCommentDeletion from "./ConfirmCommentDeletion";

/**
 * This component allows to delete a resource comment ( at least call-to-action )
 */
class DeleteComment extends React.Component {
  /**
   * Default constructor
   * @param props
   */
  constructor(props) {
    super(props);
    this.bindEventHandlers();
  }

  /**
   * Binds the component event handlers
   */
  bindEventHandlers() {
    this.delete = this.delete.bind(this);
  }

  /**
   * Call to delete the comment
   */
  delete() {
    this.context.setContext({resourceCommentId: this.props.commentId});
    this.props.dialogContext.open(ConfirmCommentDeletion);
  }

  render() {
    return (
      <>
        <a
          className="js_delete_comment"
          onClick={this.delete}>
          <span className="svg-icon">
            <Icon name="trash" />
          </span>
          <span className="visuallyhidden">delete</span>
        </a>
      </>
    );
  }
}

DeleteComment.contextType = AppContext;

DeleteComment.propTypes = {
  commentId: PropTypes.string, // The resource comment id
  dialogContext: PropTypes.any // The dialog context
};

export default withDialog(DeleteComment);
