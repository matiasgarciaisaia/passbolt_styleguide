/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2021 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */
import React, {Component} from "react";
import PropTypes from "prop-types";
import {Trans, withTranslation} from "react-i18next";
import DialogWrapper from "../../Common/Dialog/DialogWrapper/DialogWrapper";
import FormSubmitButton from "../../Common/Inputs/FormSubmitButton/FormSubmitButton";
import UserAvatar from "../../Common/Avatar/UserAvatar";
import {withAppContext} from "../../../contexts/AppContext";
import {DateTime} from "luxon";

class ReviewAccountRecovery extends Component {
  constructor(props) {
    super(props);
    this.state = this.getDefaultState();
    this.bindCallbacks();
  }

  /**
   * Returns the default component state
   */
  getDefaultState() {
    return {
      status: "reject",
      processing: false
    };
  }

  /**
   * Bind callbacks methods
   */
  bindCallbacks() {
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /**
   * Toggle the processing mode
   */
  async toggleProcessing() {
    await this.setState({processing: !this.state.processing});
  }

  /**
   * Returns true if the component must be in a processing mode
   */
  get isProcessing() {
    return this.state.processing;
  }

  /**
   * Go to the next process
   * @param event A form submit event
   */
  async handleSubmit(event) {
    event.preventDefault();
    await this.toggleProcessing();
  }

  /**
   * Handle input change
   * @param event
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  /**
   * get fingerprint
   * @param fingerprint
   * @returns string
   */
  formatFingerprint(fingerprint) {
    return fingerprint.toUpperCase().replace(/.{4}(?=.)/g, "$& ");
  }

  /**
   * Format date in time ago
   * @param {string} date The date to format
   * @return {string}
   */
  formatDateTimeAgo(date) {
    const dateTime = DateTime.fromISO(date);
    const duration = dateTime.diffNow().toMillis();
    return duration > -1000 && duration < 0 ? this.translate("Just now") : dateTime.toRelative({locale: this.props.context.locale});
  }

  /**
   * Get the user who initiated the account recovery.
   * @returns {*}
   */
  get requester() {
    return this.props.accountRecoveryRequest.user;
  }

  /**
   * Get the user firstname requester.
   * @returns {string}
   */
  get requesterFirstname() {
    return this.requester.profile.first_name;
  }

  /**
   * Get the date at when the account recovery has been initiated by the user.
   * @returns {*}
   */
  get date() {
    return this.props.accountRecoveryRequest.created;
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
    const requesterFirstname = this.requesterFirstname;
    return (
      <DialogWrapper
        title={this.translate("Review account recovery request")}
        onClose={this.props.onClose}
        disabled={this.state.processing}
        className="recovery-account-policy-dialog">
        <form onSubmit={this.handleSubmit}>
          <div className="form-content">
            <ul>
              <li className="usercard-detailed-col-2">
                <div className="content-wrapper">
                  <div className="content">
                    <div>
                      <span
                        className="tooltip tooltip-bottom"
                        data-tooltip={this.formatFingerprint(this.requester.gpgkey.fingerprint)}>
                        <span className="name-with-tooltip">{requesterFirstname}</span>
                      </span>
                      &nbsp;
                      <span className="name"><Trans>requested an account recovery</Trans></span>
                    </div>
                    <div className="subinfo light">{this.formatDateTimeAgo(this.date)}</div>
                  </div>
                </div>
                <div className="teaser-image attention-required">
                  <UserAvatar
                    user={this.requester}
                    baseUrl={this.props.context.userSettings.getTrustedDomain()}
                    attentionRequired={true}/>
                </div>
              </li>
            </ul>
            <p><strong><Trans>How do you want to proceed?</Trans></strong></p>
            <div className="radiolist-alt">
              <div className={`input radio ${this.state.status === "reject" ? "checked" : ""}`}>
                <input type="radio"
                  value="reject"
                  onChange={this.handleInputChange}
                  name="status"
                  checked={this.state.status === "reject"}
                  id="statusRecoverAccountReject"
                  disabled={this.isProcessing}/>
                <label htmlFor="statusRecoverAccountReject">
                  <span className="name"><Trans>Reject</Trans></span>
                  <span className="info">
                    <Trans>{{requesterFirstname}} did not initiate this request.</Trans>
                  </span>
                </label>
              </div>
              <div className={`input radio ${this.state.status === "approve" ? "checked" : ""}`}>
                <input type="radio"
                  value="approve"
                  onChange={this.handleInputChange}
                  name="status"
                  checked={this.state.status === "approve"}
                  id="statusRecoverAccountAccept"
                  disabled={this.isProcessing}/>
                <label htmlFor="statusRecoverAccountAccept">
                  <span className="name"><Trans>Approve</Trans></span>
                  <span className="info">
                    <Trans>I verified with <span>{{requesterFirstname}}</span> that the request is valid.</Trans>
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div className="submit-wrapper clearfix">
            <button
              className={`button button-left ${this.isProcessing ? "disabled" : ""}`}
              type="button"
              disabled={this.isProcessing}>
              {this.translate("Learn More")}
            </button>
            <FormSubmitButton
              value={this.translate("Submit")}
              disabled={this.isProcessing}
              processing={this.isProcessing}/>
            <button
              className={`button cancel ${this.isProcessing ? "disabled" : ""}`}
              role="button"
              type="button"
              onClick={this.props.onClose}
              disabled={this.isProcessing}>
              <span><Trans>Cancel</Trans></span>
            </button>
          </div>
        </form>
      </DialogWrapper>
    );
  }
}

ReviewAccountRecovery.propTypes = {
  context: PropTypes.any, // The application context
  accountRecoveryRequest: PropTypes.object, // The organization policy details
  onClose: PropTypes.func, // The close callback
  t: PropTypes.func, // The translation function
};
export default withAppContext(withTranslation("common")(ReviewAccountRecovery));
