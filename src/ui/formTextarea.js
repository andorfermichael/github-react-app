import React from "react";
import { observer } from "mobx-react";

export default observer(function({ form, field, rows = 10, cols = 25 }) {
  const classes = ["pt-textarea"];

  return (
    <div>
      <div>
        <label htmlFor={form.$(field).id}>{form.$(field).label}</label>
      </div>
      <textarea className={classes.join(" ")} {...form.$(field).bind()} rows={rows} cols={cols}/>
      <p>{form.$(field).error}</p>
    </div>
  );
});
