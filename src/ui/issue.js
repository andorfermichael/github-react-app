import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise } from "mobx-utils";
import { Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';

const plugins = { dvr: validatorjs };

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Issue Title",
    rules: "required|string|between:5,10"
  },
  {
    name: "text",
    label: "Text",
    placeholder: "Issue Description",
    rules: "required|string|between:5,25"
  }
];

class IssueForm extends MobxReactForm {
  constructor(fields, options, issueStore) {
    super(fields, options);
    this.issueStore = issueStore;
    this.options = options;

    extendObservable(this, {
      issuePostDeferred: fromPromise(Promise.resolve())
    });
  }

  onSuccess(form) {
    const { title, text } = form.values();
    let issueobject = this.options.issueobject;
    issueobject.title = title;
    issueobject.body = text;

    const resultPromise = this.issueStore.postIssue(issueobject);

    let messageSuccess = "";
    let messageFailed = "";
    if (issueobject.mode === "open") {
      messageSuccess = "issue opening successful";
      messageFailed = "issue opening failed"
    } else if (issueobject.mode === "edit") {
      messageSuccess = "issue editing successful";
      messageFailed = "issue editing failed";
    }

    resultPromise
      .then(() => Toaster.create({ position: Position.TOP }).show({
        message: messageSuccess,
        intent: Intent.SUCCESS
      }))
      .catch(() => Toaster.create({ position: Position.TOP }).show({
        message: messageFailed,
        action: { text: "retry", onClick: () => form.submit() },
        intent: Intent.DANGER
      }));
    this.issuePostDeferred = fromPromise(resultPromise);
  }
}

const FormComponent = inject("form")(
  observer(function({ form, options }) {
    return (
      <form onSubmit={form.onSubmit}>

        <FormInput form={form} field="title" />
        <FormInput form={form} field="text" />

        {form.issuePostDeferred.case({
          pending: () => <Button type="submit" loading={true} text="submit" />,
          rejected: () => (
            <Button type="submit" className="pt-icon-repeat" text="submit" />
          ),
          fulfilled: () => (
            <Button type="submit" onClick={form.onSubmit} text="submit" />
          )
        })}
        <Button onClick={form.onClear} text="clear" />
        <Button onClick={form.onReset} text="reset" />

        <p>{form.error}</p>
      </form>
    );
  })
);

export default inject("issueStore")(
  observer(
    class IssueFormComponent extends React.Component {
      constructor({ issueStore, route }) {
        super();

        const issueobject = route.props.issueobject;

        let values = {
          title: "",
          text: ""
        };
        if (issueobject.mode === "edit") {
          values = {
            title: issueobject.title,
            text: issueobject.body
          };
        }

        this.state = {
          form: new IssueForm({ fields, values }, { plugins, issueobject }, issueStore),
        };
      }
      render() {
        const { form } = this.state;
        const {route} = this.props;

        const issueobject = route.props.issueobject;

        let headline = "";
        if (issueobject.mode === "open") {
          headline = `Open issue for repository ${issueobject.repo}`;
        } else if (issueobject.mode === "edit") {
          headline = `Edit issue #${issueobject.number} of repository ${issueobject.repo}`;
        }

        return (
          <Provider form={form}>
            <div>
            <h3>{headline}</h3>
            <FormComponent />
            </div>
          </Provider>
        );
      }
    }
  )
);
