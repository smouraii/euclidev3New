import React, { Suspense, lazy } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Builder from "./Builder";
import Dashboard from "./Dashboard";
import DocsPage from "./docs/DocsPage";
import { LayoutSplashScreen } from "../../../_metronic";
import PageList from "./PageList";
import MailServer from "./MailServer";
import SecurityRoles from "./SecurityRoles";
import UserConfiguration from "./UserConfiguration";
import AuditConfiguration from "./AuditConfiguration";
import EfilesConfiguration from "./EfilesConfiguration";
import BugReport from "./BugReport";
import ErrorLog from "./ErrorLog";
import AuditLog from "./AuditLog";
import WrappedLims from "./Lims";
import WrappedDbconfiguration from "./DBConfiguration";
import FormBuilderPage from "./FormBuilderPage.Js";
import Myprofile from "./MyProfile";
import App from "../../widgets/Steps";
import StepsNewRequest from "../../widgets/Steps";

const GoogleMaterialPage = lazy(() =>
  import("./google-material/GoogleMaterialPage")
);
const ReactBootstrapPage = lazy(() =>
  import("./react-bootstrap/ReactBootstrapPage")
);

export default function HomePage() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        {
          /* Redirect from root URL to /dashboard. */
          <Redirect exact from="/" to="/dashboard" />
          /* <Redirect exact from="/401" to="/auth/login" /> */
        }
        <Route path="/builder" component={Builder} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        <Route path="/docs" component={DocsPage} />

        <Route path="/google-material" component={GoogleMaterialPage} />
        <Route path="/react-bootstrap" component={ReactBootstrapPage} />
        {/* <Route path="/docs" component={DocsPage} /> */}
        <Route path="/list/:fluxId/:pagelistid/:masterdataid" component={PageList} />
        <Route path="/list/:fluxId/:pagelistid/" component={PageList} />
        <Route path="/wizard/:fluxId/:wizardid" component={StepsNewRequest}/>
        <Route path="/newrequest" component={StepsNewRequest}/>
        <Route path="/admin/lims" component={WrappedLims}/>
        <Route path="/admin/DB-Configuration" component={WrappedDbconfiguration} />
        <Route path="/admin/MailServer" component={MailServer} />
        <Route path="/admin/Security-Roles" component={SecurityRoles} />
        <Route path="/admin/User-Configuration" component={UserConfiguration} />
        <Route path="/admin/Audit-Configuration" component={AuditConfiguration} />
         <Route path="/admin/efiles-configuration" component={EfilesConfiguration} />
       <Route path="/bugreport" component={BugReport} /> 
        <Route path="/errorlog" component={ErrorLog} />
        <Route path="/auditlog" component={AuditLog} /> 
        <Route path="/formbuilder" component={FormBuilderPage} />
        <Route path="/myprofile" component={Myprofile} />

        <Redirect to="/error/error-v1" />
      </Switch>
    </Suspense>
  );
}
