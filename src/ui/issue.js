import MobxReactForm from "mobx-react-form";
import React from "react";
import { observer, Provider, inject } from "mobx-react";
import { extendObservable } from "mobx";
import { fromPromise } from "mobx-utils";
import { Button, Intent, Toaster, Position } from "@blueprintjs/core";
import validatorjs from "validatorjs";
import FormInput from './formInput';
import FormSelect from './formSelect';
import FormTextarea from './formTextarea';
import { ReactMde, ReactMdeCommands } from 'react-mde';

const plugins = { dvr: validatorjs };

const stateOptions = [
  'open', 'closed'
];

const fields = [
  {
    name: "title",
    label: "Title",
    placeholder: "Issue Title",
    rules: "required|string|between:5,10"
  },
  {
    name: "markdown",
    label: "Text"
  },
  {
    name: "text",
  },
  {
    name: "state",
    label: "state",
    options: stateOptions,
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
  observer(function({ form, issueobject, refCallback, handleStateChange, handleMarkdownChange, selectValue, mdeValue }) {
    let commands = ReactMdeCommands.getDefaultCommands();
    mdeValue.text = issueobject.body;

    return (
      <form onSubmit={form.onSubmit}>

        <FormInput form={form} field="title" />
        <div>
          <label htmlFor={form.$("markdown").id}>{form.$("markdown").label}</label>
          <ReactMde textareaId="markdown" textareaName="markdown" field="markdown" value={mdeValue} onChange={handleMarkdownChange} commands={commands}/>
        </div>
        <FormTextarea form={form} field="text" text={issueobject} refCallback={refCallback} hidden={true}/>
        <FormSelect form={form} field="state" state={selectValue} mode={issueobject.mode} handleStateChange={handleStateChange}/>

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
          issueobject: issueobject,
          mdeValue: {text: "", selection: null}
        };
      }

      handleMarkdownChange = (value) => {
        let issueobject = this.state.issueobject;
        issueobject.body = value.text;

        // Simulate input on hidden field
        const event = new Event('input', {
          'bubbles': true,
          'cancelable': true
        });

        this._input.value = issueobject.body;
        this._input.dispatchEvent(event);

        this.setState({
          mdeValue: value,
          issueobject: issueobject
        });
      };

      handleStateChange = (e) => {
        let issueobject = this.state.issueobject;
        issueobject.state = e.target.value;

        this.setState({
          issueobject: issueobject
        });
      };

      render() {
        const { form } = this.state;
        const {route} = this.props;

        const self = this;
        function refCallback(e) {
          self._input = e;
        }

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
            <FormComponent issueobject={issueobject} refCallback={refCallback} handleStateChange={this.handleStateChange} handleMarkdownChange={this.handleMarkdownChange} selectValue={this.state.issueobject.state} mdeValue={this.state.mdeValue}/>
            </div>
          </Provider>
        );
      }
    }
  )
);
