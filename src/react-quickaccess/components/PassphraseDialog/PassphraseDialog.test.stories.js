import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import PropTypes from "prop-types";
import AppContext from "../../contexts/AppContext";
import PassphraseDialog from "./PassphraseDialog";
import {defaultAppContext} from "./PassphraseDialog.test.data";
import MockPort from "../../../react-extension/test/mock/MockPort";

export default {
  title: 'Passbolt/QuickAccess/PassphraseDialog',
  component: PassphraseDialog
};

const Template = ({context, ...args}) =>
  <AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}>
      <Route component={routerProps => <div className="container quickaccess"><PassphraseDialog {...args} {...routerProps}/></div>}/>
    </MemoryRouter>
  </AppContext.Provider>;

Template.propTypes = {
  context: PropTypes.object,
};

const parameters = {
  css: "ext_quickaccess"
};

export const Initial = Template.bind({});
Initial.args = {
  context: defaultAppContext(),
  requestId: "8e3874ae-4b40-590b-968a-418f704b9d9a",
  classname: "",
  onComplete: () => {},
};
Initial.parameters = parameters;

const mockedPort = new MockPort();
mockedPort.addRequestListener("passbolt.keyring.private.checkpassphrase", () => { throw new Error(); });

const contextRequestError = {
  port: mockedPort
};
export const ErrorPassphrase = Template.bind({});
ErrorPassphrase.args = {
  context: defaultAppContext(contextRequestError),
  requestId: "8e3874ae-4b40-590b-968a-418f704b9d9a",
  classname: "",
  onComplete: () => {},
};
ErrorPassphrase.parameters = parameters;
