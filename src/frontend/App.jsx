import React from "react";
import { MemoryRouter, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { Manager } from "extensioner";
import { ExtensionerProvider, ExtensionerEvent } from "react-extensioner";
import reducers from "./reducers/index";
import epics from "./epics/index";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { createEpicMiddleware, combineEpics } from "redux-observable";
import { reducer as notifications } from "react-notification-system-redux";
import { I18nextProvider } from "react-i18next";
import translations from "./translations/index";

import tasksExtension from "./modules/tasks/index";
import languageSwitcherExtension from "./modules/languageSwitcher/index";
import notificationExtension from "./modules/notifications/index";

const manager = new Manager();
manager.registerExtension("tasks", tasksExtension());
manager.registerExtension("languageSwitcher", languageSwitcherExtension());
manager.registerExtension("notifications", notificationExtension());

const epicMiddleware = createEpicMiddleware(
    combineEpics(...epics, ...[].concat(...Object.values(manager.getPropertyValues("epics"))))
);
const store = createStore(
    combineReducers(
        Object.assign(reducers, { notifications }, manager.getPropertyValues("reducer"))
    ),
    {},
    composeWithDevTools(applyMiddleware(epicMiddleware))
);
// translations.addResource()
export default class App extends React.Component {
    render() {
        return (
            <ExtensionerProvider manager={manager}>
                <Provider store={store}>
                    <I18nextProvider i18n={translations}>
                        <MemoryRouter>
                            <div>
                                <h2>{translations.t("appName")}</h2>
                                <ul>
                                    <ExtensionerEvent
                                        name={"onRenderMenuLink"}
                                        value={translations}
                                    />
                                </ul>

                                <hr />
                                <Switch>
                                    <ExtensionerEvent name={"onRenderRoute"} />
                                </Switch>
                                <ExtensionerEvent name={"onRenderRootComponent"} />
                            </div>
                        </MemoryRouter>
                    </I18nextProvider>
                </Provider>
            </ExtensionerProvider>
        );
    }
}