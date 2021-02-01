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
import {withAppContext} from "../../../contexts/AppContext";
import PropTypes from "prop-types";
import {withTranslation} from "react-i18next";

class DisplayRequireInvitationError extends Component {
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
      <div className="setup-error">
        <h1>{this.translate("Access to this service requires an invitation.")}</h1>
        <p>{this.translate("This email is not associated with any approved users on this domain.")} {this.translate("Please contact your administrator to request an invitation link.")}</p>
        <div className="form-actions">
          <a href={`${this.props.context.trustedDomain}/users/recover`} className="button primary big full-width" role="button">{this.translate("Try with another email")}</a>
        </div>
      </div>
    );
  }
}

DisplayRequireInvitationError.propTypes = {
  context: PropTypes.any, // The application context
  t: PropTypes.func, // The translation function
};
export default withAppContext(withTranslation('common')(DisplayRequireInvitationError));
