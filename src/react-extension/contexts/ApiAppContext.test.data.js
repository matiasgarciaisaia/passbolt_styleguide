/**
 * Passbolt ~ Open source password manager for teams
 * Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 *
 * Licensed under GNU Affero General Public License version 3 of the or any later version.
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) 2022 Passbolt SA (https://www.passbolt.com)
 * @license       https://opensource.org/licenses/AGPL-3.0 AGPL License
 * @link          https://www.passbolt.com Passbolt(tm)
 * @since         3.6.0
 */

import {v4 as uuidv4} from "uuid";
import SiteSettings from "../../shared/lib/Settings/SiteSettings";
import siteSettingsFixture from "../test/fixture/Settings/siteSettings";
import {ApiClientOptions} from "../../shared/lib/apiClient/apiClientOptions";

/**
 * Returns the default api app context for the unit test
 * @param {Object} appContext (Optional)Properties to override
 * @returns {Object}
 */

export function defaultAppContext(appContext = {}) {
  const siteSettings = new SiteSettings(siteSettingsFixture);
  const defaultAppContext = {
    locale: 'en-UK',
    siteSettings,
    trustedDomain: "https://passbolt.local",
    loggedInUser: {
      id: uuidv4(),
      role: {
        name: 'admin'
      }
    },
    baseUrl: "https://passbolt.local",
    getApiClientOptions: () => new ApiClientOptions()
      .setBaseUrl("https://passbolt.local")
      .setCsrfToken("ca880ecf37c9bb06bd32d5967b050b324a4a5c3f9bc5b9dcbde31f0526c876286ffd0b0b5f920340b8c8829fb00c0edecacacd668f151a895782d9241a433413")
  };
  return Object.assign(defaultAppContext, appContext);
}
