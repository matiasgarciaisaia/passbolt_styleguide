import React from "react";
import {MemoryRouter, Route} from "react-router-dom";
import ImportResourcesResult from "./ImportResourcesResult";
import AppContext from "../../../contexts/AppContext";


export default {
  title: 'Passbolt/Resource/ImportResources/ImportResourcesResult',
  component: ImportResourcesResult
};

const context = {
  siteSettings: {
    canIUse: () => true
  }
};


const Template = args =>
  <AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}>
      <Route component={routerProps => <ImportResourcesResult {...args} {...routerProps}/>}></Route>
    </MemoryRouter>
  </AppContext.Provider>;


export const Initial = Template.bind({});
Initial.args = {
  resourceWorkspaceContext: {
    resourceFileImportResult: {
      created: {
        foldersCount: 10,
        resourcesCount: 15
      }
    }
  }
};
