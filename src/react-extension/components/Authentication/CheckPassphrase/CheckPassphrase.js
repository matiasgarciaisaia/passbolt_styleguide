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
 * @since         3.0.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Trans, withTranslation} from "react-i18next";
import Password from "../../../../shared/components/Password/Password";

/**
 * The component display variations.
 * @type {Object}
 */
export const CheckPassphraseVariations = {
  SETUP: 'Setup',
  RECOVER: 'Recover'
};

/**
 * This component checks the passphrase of an user gpg key
 */
class CheckPassphrase extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.state = this.defaultState;
    this.bindEventHandlers();
    this.createReferences();
  }

  /**
   * Returns the default state
   */
  get defaultState() {
    return {
      passphrase: '', // The passphrase
      rememberMe: false, // The remember passphrase flag
      isObfuscated: true, // True if the passphrase should not be visible
      actions: {
        processing: false // True if one's processing passphrase
      },
      hasBeenValidated: false, // true if the form has already validated once
      errors: {
        emptyPassphrase: false, // True if the passphrase is empty
        invalidPassphrase: false, // True if the passphrase is invalid
      }
    };
  }

  /**
   * Returns true if the user can perform actions on the component
   */
  get areActionsAllowed() {
    return !this.state.actions.processing;
  }

  /**
   * Returns true if the passphrase is valid
   */
  get isValid() {
    return Object.values(this.state.errors).every(value => !value);
  }

  /**
   * Returns true if the component must be in a processing mode
   */
  get isProcessing() {
    return this.state.actions.processing;
  }

  /**
   * Return true if there are errors
   */
  get hasErrors() {
    return this.state.errors.emptyPassphrase || this.state.errors.invalidPassphrase;
  }

  /**
   * Whenever the component is mounted
   */
  componentDidMount() {
    this.focusOnPassphrase();
  }

  /**
   * Handle component event handlers
   */
  bindEventHandlers() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangePassphrase = this.handleChangePassphrase.bind(this);
    this.handleToggleRememberMe = this.handleToggleRememberMe.bind(this);
  }

  /**
   * Creates the references
   */
  createReferences() {
    this.passphraseInputRef = React.createRef();
  }

  /**
   * Whenever the users submits his passphrase
   * @param event Dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.validate();

    if (this.isValid) {
      await this.toggleProcessing();
      await this.check();
    }
  }

  /**
   * Whenever the user changes the private key
   * @param event An input event
   */
  async handleChangePassphrase(event) {
    const passphrase = event.target.value;
    await this.fillPassphrase(passphrase);
    if (this.state.hasBeenValidated) {
      await this.validate();
    }
  }

  /**
   * Whenever the user toggles the remember me flag
   */
  async handleToggleRememberMe() {
    await this.toggleRemmemberMe();
  }

  /**
   * Check the private gpg key passphrase
   */
  async check() {
    await this.props.onComplete(this.state.passphrase, this.state.rememberMe)
      .catch(this.onCheckFailure.bind(this));
  }

  /**
   * Whenever the gpg key import failed
   * @param {Error} error The error
   * @throw {Error} If an unexpected errors hits the component. Errors not of type: InvalidMasterPasswordError.
   */
  onCheckFailure(error) {
    // Whenever the passphrase is invalid.
    this.toggleProcessing();
    if (error.name === "InvalidMasterPasswordError") {
      this.setState({errors: {invalidPassphrase: true}});
    } else {
      throw error;
    }
  }

  /**
   * Fill the passphrase
   * @param passphrase A passphrase
   */
  async fillPassphrase(passphrase) {
    await this.setState({passphrase});
  }

  /**
   * Toggle the remember me flag value
   */
  async toggleRemmemberMe() {
    await this.setState({rememberMe: !this.state.rememberMe});
  }

  /**
   * Validate the security token data
   */
  async validate() {
    const {passphrase} = this.state;
    const emptyPassphrase = passphrase.trim() === '';
    if (emptyPassphrase) {
      await this.setState({hasBeenValidated: true, errors: {emptyPassphrase}});
      return;
    }
    await this.setState({hasBeenValidated: true, errors: {}});
  }

  /**
   * Toggle the processing mode
   */
  async toggleProcessing() {
    await this.setState({actions: {processing: !this.state.actions.processing}});
  }

  /**
   * Put the focus on the passphrase input
   */
  focusOnPassphrase() {
    this.passphraseInputRef.current.focus();
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
   */
  render() {
    const processingClassName = this.isProcessing ? 'processing' : '';
    return (
      <div className="check-passphrase">
        <h1><Trans>Please enter your passphrase to continue.</Trans></h1>
        <form acceptCharset="utf-8" onSubmit={this.handleSubmit} className="enter-passphrase">
          <div className="form-content">
            <div className={`input-password-wrapper input required ${this.hasErrors ? "error" : ""}`}>
              <label htmlFor="passphrase"><Trans>Passphrase</Trans></label>
              <Password
                id="passphrase"
                autoComplete="off"
                inputRef={this.passphraseInputRef}
                name="passphrase"
                value={this.state.passphrase}
                preview={true}
                onChange={this.handleChangePassphrase}
                disabled={!this.areActionsAllowed}/>
              {this.state.hasBeenValidated &&
              <>
                {this.state.errors.emptyPassphrase &&
                  <div className="empty-passphrase error-message"><Trans>The passphrase should not be empty.</Trans></div>
                }
                {this.state.errors.invalidPassphrase &&
                <div className="invalid-passphrase error-message"><Trans>The passphrase is invalid.</Trans></div>
                }
              </>
              }
            </div>
            {this.props.canRememberMe &&
              <div className="input checkbox">
                <input
                  id="remember-me"
                  type="checkbox"
                  name="remember-me"
                  value={this.state.rememberMe}
                  onChange={this.handleToggleRememberMe}
                  disabled={!this.areActionsAllowed}/>
                <label htmlFor="remember-me">
                  <Trans>Remember until signed out.</Trans>
                </label>
              </div>
            }
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className={`button primary big full-width ${processingClassName}`}
              role="button"
              disabled={this.isProcessing}>
              <Trans>Verify</Trans>
            </button>
            {this.props.onSecondaryActionClick &&
            <a onClick={this.props.onSecondaryActionClick}>
              {{
                [CheckPassphraseVariations.SETUP]: <Trans>I lost my passphrase, generate a new private key.</Trans>,
                [CheckPassphraseVariations.RECOVER]: <Trans>Help, I lost my passphrase.</Trans>,
              }[this.props.displayAs]}
            </a>
            }
          </div>
        </form>
      </div>
    );
  }
}

CheckPassphrase.defaultProps = {
  displayAs: CheckPassphraseVariations.SETUP,
};

CheckPassphrase.propTypes = {
  onComplete: PropTypes.func.isRequired, // The callback to trigger when the user wants to verify its passphrase
  displayAs: PropTypes.PropTypes.oneOf([
    CheckPassphraseVariations.SETUP,
    CheckPassphraseVariations.RECOVER
  ]), // Defines how the form should be displayed and behaves
  canRememberMe: PropTypes.bool, // True if the remember me flag must be displayed
  onSecondaryActionClick: PropTypes.func, // Callback to trigger when the user clicks on the secondary action link.
  t: PropTypes.func, // The translation function
};
export default withTranslation('common')(CheckPassphrase);
