import React, { Component } from "react";
import "./App.scss";

export default class extends Component {
  componentDidMount() {
    let url = "https://api.datamuse.com/words?ml=hell";
    fetch(url)
      .then(r => {
        return r.json();
      })
      .then(data => {
        console.log(data);
      });
  }
  render() {
    return <>Hey up..</>;
  }
}
