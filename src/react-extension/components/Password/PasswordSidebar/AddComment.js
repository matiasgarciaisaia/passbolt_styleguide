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
import UserAvatar from "../../../../react/components/Common/Avatar/UserAvatar";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import {withLoading} from "../../../../react/contexts/Common/LoadingContext";

/**
 * This component allows the current user to add a new comment on a resource
 */
class AddComment extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.bindCallbacks();
    this.createRefs();
  }

  /**
   * ComponentDidMount
   * Invoked immediately after component is inserted into the tree
   * @return {void}
   */
  componentDidMount() {
    this.textareaRef.current.focus();
  }

  /**
   * Get default state
   * @returns {*}
   */
  getDefaultState() {
    return {
      content: "", // The comment content
      actions: { // The ongoing action
        processing: false, // An action is processing
      },
      errors: {} // The list of validation errors
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
    this.handleCancelEvent = this.handleCancelEvent.bind(this);
    this.handleContentChanged = this.handleContentChanged.bind(this);
    this.handleEscapeKeyPressed = this.handleEscapeKeyPressed.bind(this);
  }

  /**
   * Create DOM nodes or React elements references in order to be able to access them programmatically.
   */
  createRefs() {
    this.textareaRef = React.createRef();
  }

  /**
   * @returns {boolean} Returns true if the form is valid
   */
  get isValid() {
    return Object.values(this.state.errors).every(value => ! value);
  }

  /**
   * Handle the submitting of the new comment
   * @param event The event object
   */
  async handleSubmitEvent(event) {
    // Prevent the default browser behavior to post the form.
    event.preventDefault();

    await this.validate();

    if (this.isValid) {
      try {
        await this.setState({actions: {processing: true}});
        this.props.loadingContext.add();
        const addedComment = await this.add();
        await this.handleSubmitSuccess(addedComment);
      } catch (error) {
        await this.handleSubmitFailure(error);
      }
    }
  }

  /**
   * Whenever the submit action has been successful
   * @param addedComment The added comment
   */
  async handleSubmitSuccess(addedComment) {
    this.props.loadingContext.remove();
    await this.props.actionFeedbackContext.displaySuccess("The comment has been added successfully");
    this.props.onAdd(addedComment);
  }

  /**
   * Whenever the submit action has not been successful
   * @param error
   * @returns {Promise<void>}
   */
  async handleSubmitFailure(error) {
    this.props.loadingContext.remove();
    await this.props.actionFeedbackContext.displayError(error.message);
    await this.setState({
      actions: {processing: false},
      errors: {technicalError: error.message}
    });
  }

  /**
   * Handle the cancellation of the add of the comment
   */
  handleCancelEvent() {
    this.props.onCancel();
  }

  /**
   * Whenever the content has changed
   * @param event The DOM event
   */
  handleContentChanged(event) {
    this.setState({content: event.target.value});
  }

  /**
   * Whenever the user press the escape key
   * @param event Keypressed event
   */
  handleEscapeKeyPressed(event) {
    // Close the dialog when the user presses the "ESC" key if the component is cancellable.
    const hasEscapeKeyPressed = event.keyCode === 27;
    const mustQuit = hasEscapeKeyPressed && this.props.cancellable;
    if (mustQuit) {
      // Stop the event propagation in order to avoid a parent component to react to this ESC event.
      event.stopPropagation();
      this.props.onCancel();
    }
  }

  /**
   * Add a new comment
   * @returns {Promise<void>}
   */
  async add() {
    const commentToAdd = this.state.content.trim();
    const payload =  {
      foreign_key: this.props.resource.id,
      foreign_model: 'Resource',
      content: commentToAdd,
      user_id: this.context.loggedInUser.id
    };

    return await this.context.port.request('passbolt.comments.create', payload);
  }

  /**
   * Validate the form.
   */
  async validate() {
    // Rule: the content could not be empty or trimmered empty
    const isEmpty = this.state.content.trim() === '';

    // Rule: the content could not be longer than 256
    const isTooLong = this.state.content.length > 256;

    const errors = {isEmpty, isTooLong};
    await this.setState({errors});
  }

  /**
   * Render the component
   * @returns {JSX}
   */
  render() {
    return (
      <form
        className="comment"
        autoComplete="off">
        <div className="wrap-right-column">
          <div className="right-column">
            <div className="form-content">

              <div className="input textarea required">
                <textarea ref={this.textareaRef}
                  placeholder="Add a comment"
                  onChange={this.handleContentChanged}
                  onKeyDown={this.handleEscapeKeyPressed}
                  disabled={this.state.actions.processing}>
                </textarea>
                <div className="message error">
                  {this.state.errors.isEmpty && "A comment is required."}
                  {this.state.errors.isTooLong && "A comment must be less than 256 characters"}
                  {this.state.errors.technicalError}
                </div>
              </div>

              <div className="metadata">
                <span className="author username">
                  <a href="#">You</a>
                </span>
                <span className="modified">right now</span>
              </div>
              <div className="actions">
                <button
                  className="button comment-submit"
                  type="submit"
                  onClick={this.handleSubmitEvent}
                  disabled={this.state.actions.processing}>
                                    Send
                </button>
                {
                  this.props.cancellable &&
                  <button
                    className="button cancel"
                    role="button"
                    onClick={this.handleCancelEvent}
                    disabled={this.state.actions.processing}>
                    <span>Cancel</span>
                  </button>
                }
              </div>
            </div>
          </div>
        </div>
        <div className="left-column">
          <UserAvatar
            user={this.context.loggedInUser}
            baseUrl={this.context.siteSettings.settings.app.url}
            className="author profile picture"/>
        </div>
      </form>
    );
  }
}

AddComment.contextType = AppContext;

AddComment.propTypes = {
  resource: PropTypes.object, // The resource to which one add a comment
  onAdd: PropTypes.func, // Called after the comment has been added
  onCancel: PropTypes.func, // Called after the add operation has been cancelled
  cancellable: PropTypes.bool, // Flag to determine if the user can cancel
  actionFeedbackContext: PropTypes.any, // The action feedback context
  loadingContext: PropTypes.any // The loading context
};

export default withLoading(withActionFeedback(AddComment));
