import React from "react";
import { observer } from "mobx-react";

export default observer(function({ form, field, state = "open", mode, handleChange }) {
  const classes = ["pt-select"];

  if (mode === "edit") {
    return (
      <div>
        <label className="pt-label " htmlFor={form.$(field).id}>
          {form.$(field).label}
        </label>
        <select className={classes.join(" ")} {...form.$(field).bind()} value={state} onChange={(e) => handleChange(e)}>
          {
            form.$(field).value.options.map(
              val =>
                <option key={val} value={val}>{val}</option>

            )
          }
        </select>
        <p>{form.$(field).error}</p>
      </div>
    );
  } else {
    return <div></div>
  }
});
