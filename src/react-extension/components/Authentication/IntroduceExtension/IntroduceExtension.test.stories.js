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

import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import IntroduceExtension from "./IntroduceExtension";

export default {
  title: 'Passbolt/Authentication/IntroduceExtension',
  component: IntroduceExtension
};

const Template = args =>
  <div id="container" className="container page login">
    <div className="content">
      <div className="login-form">
        <MemoryRouter initialEntries={['/']}>
          <Route component={routerProps => <IntroduceExtension {...args} {...routerProps}/>}/>
        </MemoryRouter>
      </div>
    </div>
  </div>;


export const Initial = Template.bind({});
Initial.parameters = {
  css: "ext_authentication"
};
