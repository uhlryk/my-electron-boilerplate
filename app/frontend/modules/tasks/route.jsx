import React from "react";
import { Link, Route } from "react-router-dom";
import ListTasks from "./components/ListTasks";
import AddTaskForm from "./components/AddTaskForm";
import RemoveTask from "./components/RemoveTask";

const route = ({ match }) => (
    <div>
        <h3>Tasks section</h3>
        <ul>
            <li>
                <Link to={match.url}>tasksList {match.url}</Link>
            </li>
            <li>
                <Link to={`${match.url}/add`}>Add Task</Link>
            </li>
        </ul>

        <hr />

        <Route exact path={match.url} component={ListTasks} />
        <Route
            path={`${match.url}/add`}
            render={() => <AddTaskForm onSuccessRedirect={match.url} />}
        />
        <Route
            path={`${match.url}/remove/:taskId`}
            render={() => <RemoveTask onSuccessRedirect={match.url} />}
        />
    </div>
);

export default route;