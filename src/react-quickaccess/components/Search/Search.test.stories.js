import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import PropTypes from "prop-types";
import AppContext from "../../contexts/AppContext";
import Search from "./Search";
import {defaultAppContext} from "./Search.test.data";

export default {
  title: 'Passbolt/QuickAccess/Search',
  component: Search
};

const Template = ({context, ...args}) =>
  <AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}>
      <Route component={routerProps => <div className="container quickaccess"><Search {...args} {...routerProps}/></div>}/>
    </MemoryRouter>
  </AppContext.Provider>;

Template.propTypes = {
  context: PropTypes.object,
};


export const Initial = Template.bind({});
Initial.args = {
  context: defaultAppContext(),
};
Initial.parameters = {
  css: "ext_quickaccess"
};
