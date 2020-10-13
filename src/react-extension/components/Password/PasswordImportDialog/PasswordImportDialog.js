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
 * @since         2.14.0
 */

import React, {Component} from "react";
import PropTypes from "prop-types";
import AppContext from "../../../contexts/AppContext";
import {withActionFeedback} from "../../../contexts/ActionFeedbackContext";
import {withDialog} from "../../../../react/contexts/Common/DialogContext";
import DialogWrapper from "../../../../react/components/Common/Dialog/DialogWrapper/DialogWrapper";
import FormSubmitButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormSubmitButton";
import FormCancelButton from "../../../../react/components/Common/Inputs/FormSubmitButton/FormCancelButton";
import Icon from "../../Common/Icons/Icon";

class PasswordImportDialog extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindHandlers();
    this.createReferences();
  }

  /**
   * Returns the default state
   */
  get defaultState() {
    return {
      fileToImport: null, // The file to import
      options: {
        importFolders: true, // Import all the folders specified in the CSV / KDBX file
        importTags: true // Use unique tags for this import
      }, // The current import options
      errors: {} // Validation errors
    };
  }

  /**
   * Bind component handlers
   */
  bindHandlers() {
    this.handleSelectFile = this.handleSelectFile.bind(this);
    this.handleFileSelected = this.handleFileSelected.bind(this);
    this.handleImportFoldersOptionChanged = this.handleImportFoldersOptionChanged.bind(this);
    this.handleImportTagsOptionChanged = this.handleImportTagsOptionChanged.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Create elements references
   */
  createReferences() {
    this.fileUploaderRef = React.createRef();
  }

  /**
   * Returns the CSS style of the choose file addon button
   */
  get chooseFileStyle() {
    return {
      width: "35%",
      padding: "11px 0px 5px 0px",
      display: "inline-block",
      marginLeft: "-2px",
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0
    };
  }

  /**
   * Returns true if the import form data are valid
   */
  get isValid() {
    return this.state.fileToImport;
  }

  /**
   * Returns the selected file's name
   */
  get selectedFilename() {
    return this.state.fileToImport ? this.state.fileToImport.name : '';
  }

  /**
   * Returns the extension of the selected file
   */
  get selectedFileExtension() {
    const splitFilename = this.state.fileToImport.name.split('.');
    return splitFilename[splitFilename.length - 1];
  }


  /**
   * Handle the selection of a file by file explorer
   */
  handleSelectFile() {
    this.fileUploaderRef.current.click();
  }

  /**
   * Handle the event that a file has been selected
   * @param event A dom event
   */
  handleFileSelected(event) {
    const [fileToImport] = event.target.files;
    this.setState({fileToImport});
  }

  /**
   * Handle the change of import folders option
   */
  async handleImportFoldersOptionChanged() {
    const options = Object.assign({}, this.state.options, {importFolders: !this.state.options.importFolders});
    await this.setState({options});
  }

  /**
   * Handle the change of unique tag options
   */
  async handleImportTagsOptionChanged() {
    const options = Object.assign({}, this.state.options, {uniqueTag: !this.state.options.uniqueTag});
    await this.setState({options});
  }

  /**
   * Handle the cancellation of the import
   */
  handleCancel() {
    this.close();
  }

  /**
   * Handle the import submit event
   * @param event A dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.resetValidation()
      .then(this.import.bind(this))
      .then(this.close.bind(this))
      .catch(this.invalidate.bind(this));
  }

  /**
   * Close the dialog
   */
  close() {
    this.props.onClose();
  }

  /**
   * Read the selected file and returns its content in a base 64
   */
  readFile() {
    const reader = new FileReader();
    return new Promise(resolve => {
      reader.onloadend = event => resolve(event.target.result);
      reader.readAsDataURL(this.state.fileToImport);
    });
  }

  /**
   * Import the selected file with its given base 64 content
   */
  async import() {
    await this.context.port.emit("passbolt.import-passwords.import-file", {
      b64FileContent: await this.readFile,
      fileType: this.selectedFileExtension,
      options: this.state.options
    });
  }

  /**
   * Invalidate the selected file as possible file to import
   */
  async invalidate() {
    await this.setState({errors: {invalidFile: true}});
  }

  /**
   * Reset the validation process
   */
  async resetValidation() {
    await this.setState({errors: {}});
  }
  /**
   * Render the component
   */
  render() {
    const errors = this.state.errors;
    const isInvalidFile = errors && errors.invalidFile;
    const invalidFileClassName = isInvalidFile ? 'errors' : '';
    return (
      <DialogWrapper
        title="Import password"
        onClose={this.handleCancel}>
        <form onSubmit={this.handleSubmit}>
          <div className="form-content">
            <div className={`input text required ${invalidFileClassName}`}>
              <input
                type="file"
                ref={this.fileUploaderRef}
                style={{display: "None"}}
                onChange={this.handleFileSelected}
                accept=".csv, .kdbx, .kdb"/>
              <label>
                Select a file to import
                (<a role="link" data-tooltip="csv exports from keepassx, lastpass and 1password are supported">csv</a> or <a role="link" data-tooltip="kdbx files are files generated by keepass v2.x">kdbx</a>)
              </label>

              <input
                type="text"
                style={{width: "60%", textOverflow: "ellipsis"}}
                placeholder="No file selected"
                disabled
                value={this.selectedFilename}/>
              <a
                style={this.chooseFileStyle}
                className="button primary"
                onClick={this.handleSelectFile}>
                <Icon name="upload-a" />
                <strong  style={{marginLeft: "7px"}}>
                  Choose a file
                </strong>
              </a>

              {isInvalidFile &&
                <div className="message ready error">
                  This file is invalid and cannot be imported.
                </div>
              }
            </div>

            <div className="input text">
              <input
                type="checkbox"
                checked={this.state.options.importTags}
                onChange={this.handleImportTagsOptionChanged}/>
              <label>Add a unique import tag to passwords</label>
            </div>

            <div className="input text">
              <input
                type="checkbox"
                checked={this.state.options.importFolders}
                onChange={this.handleImportFoldersOptionChanged}/>
              <label>Import folders</label>
            </div>
          </div>
          <div className="submit-wrapper clearfix">
            <FormSubmitButton
              value="Import"
              disabled={!this.isValid}/>
            <FormCancelButton onClick={this.handleCancel}/>
          </div>

        </form>
      </DialogWrapper>
    );
  }
}


PasswordImportDialog.contextType = AppContext;

PasswordImportDialog.propTypes = {
  onClose: PropTypes.func,
  actionFeedbackContext: PropTypes.any, // The action feedback context
  dialogContext: PropTypes.any // The dialog context
};

export default withActionFeedback(withDialog(PasswordImportDialog));
