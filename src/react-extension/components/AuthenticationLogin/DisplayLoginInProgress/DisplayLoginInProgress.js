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

/**
 * This component displays an in progress feedback to the user when he's log in
 */
class DisplayLoginInProgress extends Component {
  /**
   * Render the component
   */
  render() {
    return (
      <div className="login-processing">
        <div className="processing-wrapper">
          <span className="processing"></span>
        </div>
        <h1>Logging in, please wait...</h1>
      </div>
    );
  }
}

export default DisplayLoginInProgress;
