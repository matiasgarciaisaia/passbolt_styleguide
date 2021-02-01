/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2020 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         2.12.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";

import AppContext from "../../../contexts/AppContext";
import ErrorDialog from "../../Dialog/ErrorDialog/ErrorDialog";
import DialogWrapper from "../../../../react/components/Common/Dialog/DialogWrapper/DialogWrapper";
import FormSubmitButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormCancelButton";
import {withDialog} from "../../../../react/contexts/Common/DialogContext";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import {withTranslation} from "react-i18next";

class FolderRenameDialog extends Component {
  /**
   * Constructor
   * @param {Object} props
   * @param {Object} context
   */
  constructor(props, context) {
    super(props, context);
    this.state = this.getStateBasedOnContext(context, props,  this.getDefaultState());
    this.createInputRefs();
    this.bindEventHandlers();
  }

  /**
   * ComponentDidMount
   * Invoked immediately after component is inserted into the tree
   * @return {void}
   */
  async componentDidMount() {
    this.setState({loading: false}, () => {
      this.nameRef.current.focus();
    });
  }

  /**
   * Return default state
   * @returns {Object} default state
   */
  getDefaultState() {
    return {
      // Dialog states
      loading: true,
      processing: false,
      inlineValidation: false,

      // Fields and errors
      name: this.translate("loading..."),
      nameError: false,
    };
  }

  /**
   * Return default state based on context and props
   * For example if folder doesn't exist then we show an error message
   * Otherwise set the input name value
   *
   * @param context
   * @param props
   * @param defaultState
   * @returns {*}
   */
  getStateBasedOnContext(context, props, defaultState) {
    const folders = context.folders;
    const error = {
      message: this.translate("The folder could not be found. Maybe it was deleted or you lost access.")
    };
    if (!folders) {
      console.error(`No folders context defined.`);
      this.handleError(error);
    }
    const folder = context.folders.find(item => item.id === context.folder.id) || false;
    if (!folder) {
      console.error(`Folder ${context.folder.id} not found in context.`);
      this.handleError(error);
    } else {
      defaultState.name = folder.name;
    }
    return defaultState;
  }

  /**
   * Create references
   * @returns {void}
   */
  createInputRefs() {
    this.nameRef = React.createRef();
  }

  /**
   * Bind event handlers
   * @returns {void}
   */
  bindEventHandlers() {
    this.handleClose = this.handleClose.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /**
   * Handle close button click.
   * @returns {void}
   */
  handleClose() {
    this.props.onClose();
  }

  /**
   * Handle form input changes.
   * @params {ReactEvent} The react event
   * @returns {void}
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => {
      if (this.state.inlineValidation) {
        this.validate();
      }
    });
  }

  /**
   * Handle form submit event.
   * @params {ReactEvent} The react event
   * @returns {void}
   */
  async handleFormSubmit(event) {
    event.preventDefault();

    // Do not re-submit an already processing form
    if (this.state.processing) {
      return;
    }

    // After first submit, inline validation is on
    this.setState({
      inlineValidation: this.state.inlineValidation || true
    });

    await this.toggleProcessing();
    await this.validate();
    if (this.hasValidationError()) {
      await this.toggleProcessing();
      this.focusFirstFieldError();
      return;
    }

    try {
      const folder = await this.updateFolder();
      await this.handleSaveSuccess(folder.id);
    } catch (error) {
      this.handleSaveError(error);
    }
  }

  /**
   * Handle save operation success.
   */
  async handleSaveSuccess(folderId) {
    await this.props.actionFeedbackContext.displaySuccess(this.translate("The folder was renamed successfully"));
    this.selectAndScrollToFolder(folderId);
    this.props.onClose();
  }

  /**
   * Handle save operation error.
   * @param {object} error The returned error
   */
  handleSaveError(error) {
    // It can happen when the user has closed the passphrase entry dialog by instance.
    if (error.name === "UserAbortsOperationError") {
      this.setState({processing: false});
    } else {
      // Unexpected error occurred.
      console.error(error);
      this.handleError(error);
      this.setState({processing: false});
    }
  }

  /**
   * handle error to display the error dialog
   * @param error
   */
  handleError(error) {
    const errorDialogProps = {
      title: this.translate("There was an unexpected error..."),
      message: error.message
    };
    this.context.setContext({errorDialogProps});
    this.props.dialogContext.open(ErrorDialog);
  }

  /**
   * Toggle processing state
   * @returns {Promise<void>}
   */
  async toggleProcessing() {
    const prev = this.state.processing;
    return new Promise(resolve => {
      this.setState({processing: !prev}, resolve());
    });
  }

  /**
   * Focus the first field of the form which is in error state.
   * @returns {void}
   */
  focusFirstFieldError() {
    this.nameRef.current.focus();
  }

  /**
   * Update the folder
   * @returns {Promise<Object>} Folder entity or Error
   */
  async updateFolder() {
    const folderDto = {
      id: this.context.folder.id,
      name: this.state.name
    };
    return await this.context.port.request("passbolt.folders.update", folderDto);
  }

  /**
   * Select and scroll to a given resource.
   * @param {string} id The resource id.
   * @returns {void}
   */
  selectAndScrollToFolder(id) {
    this.context.port.emit("passbolt.folders.select-and-scroll-to", id);
  }

  /**
   * Validate the form.
   * @returns {Promise<boolean>}
   */
  async validate() {
    await this.resetValidation();
    await this.validateNameInput();
    return this.hasValidationError();
  }

  /**
   * Reset validation errors
   * @returns {Promise<void>}
   */
  async resetValidation() {
    return new Promise(resolve => {
      this.setState({nameError: false}, resolve());
    });
  }

  /**
   * Validate the name input.
   * @returns {Promise<void>}
   */
  validateNameInput() {
    let nameError = false;
    const name = this.state.name.trim();
    if (!name.length) {
      nameError = this.translate("A name is required.");
    }
    if (name.length > 64) {
      nameError = this.translate("A name can not be more than 64 char in length.");
    }
    return new Promise(resolve => {
      this.setState({nameError: nameError}, resolve);
    });
  }

  /**
   * Return true if the form has some validation error
   * @returns {boolean}
   */
  hasValidationError() {
    return (this.state.nameError !== false);
  }

  /**
   * Should input be disabled? True if state is loading or processing
   * @returns {boolean}
   */
  hasAllInputDisabled() {
    return this.state.processing || this.state.loading;
  }

  /**
   * Get the translate function
   * @returns {function(...[*]=)}
   */
  get translate() {
    return this.props.t;
  }

  /**
   * Render
   * @returns {*}
   */
  render() {
    return (
      <DialogWrapper className='rename-folder-dialog' title={this.translate("Rename a folder")}
        onClose={this.handleClose} disabled={this.hasAllInputDisabled()}>
        <form className="folder-rename-form" onSubmit={this.handleFormSubmit} noValidate>
          <div className="form-content">
            <div className={`input text required ${this.state.nameError ? "error" : ""}`}>
              <label htmlFor="folder-name-input">{this.translate("Folder name")}</label>
              <input id="folder-name-input" name="name"
                ref={this.nameRef}
                type="text" value={this.state.name} placeholder={this.translate("Untitled folder")}
                maxLength="64" required="required"
                onChange={this.handleInputChange}
                disabled={this.hasAllInputDisabled()}
                autoComplete="off" autoFocus={true}
              />
              {this.state.nameError &&
                <div className="name error message">{this.state.nameError}</div>
              }
            </div>
          </div>
          <div className="submit-wrapper clearfix">
            <FormSubmitButton disabled={this.hasAllInputDisabled()} processing={this.state.processing} value={this.translate("Rename")}/>
            <FormCancelButton disabled={this.hasAllInputDisabled()} onClick={this.handleClose} />
          </div>
        </form>
      </DialogWrapper>
    );
  }
}

FolderRenameDialog.contextType = AppContext;

FolderRenameDialog.propTypes = {
  onClose: PropTypes.func,
  actionFeedbackContext: PropTypes.any, // The action feedback context
  dialogContext: PropTypes.any, // The dialog context
  t: PropTypes.func, // The translation function
};

export default withDialog(withActionFeedback(withTranslation('common')(FolderRenameDialog)));
