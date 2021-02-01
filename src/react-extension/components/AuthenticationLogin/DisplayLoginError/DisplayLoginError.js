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
import {AuthenticationContext} from "../../../contexts/AuthenticationContext";
import {withTranslation} from "react-i18next";

/**
 * This component displays an error when the user cannot log in
 */
class DisplayLoginError extends Component {
  /**
   * Default constructor
   * @param props Component props
   */
  constructor(props) {
    super(props);
    this.bindEventHandlers();
  }

  /**
   * Handle component event handlers
   */
  bindEventHandlers() {
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  /**
   * Whenever the users wants to try to log in again
   * @param event Dom event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.context.onTryLoginAgainRequested();
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
    return (
      <div>
        <h1>{this.translate("Sorry, you have not been signed in.")}</h1>
        <p>{this.translate("Something went wrong, the sign in failed with the following error:")} </p>
        <p>{this.props.error && this.props.error.message}</p>
        <form
          acceptCharset="utf-8"
          onSubmit={this.handleSubmit}>
          <div className="form-actions">
            <button
              type="submit"
              className={`button primary big full-width`}
              role="button">
              {this.translate("Try again")}
            </button>
          </div>
        </form>
      </div>
    );
  }
}

DisplayLoginError.contextType = AuthenticationContext;
DisplayLoginError.propTypes = {
  error: PropTypes.any, // The error to display
  t: PropTypes.func, // The translation function
};
export default withTranslation('common')(DisplayLoginError);
