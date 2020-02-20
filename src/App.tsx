import React, { Component } from "react";
import "./App.scss";

export default class extends Component {
  state = { phrase: "" };
  apiDebouncer: number = 0;

  componentDidMount() {
    let url = `https://iinvq9pu20.execute-api.us-east-1.amazonaws.com/dev/synonyms?phrase=hell+explorer`;
    fetch(url)
      .then(r => {
        return r.json();
      })
      .then(data => {
        const { synonyms } = data;
        console.log(synonyms);
      });
  }
  getSynonyms(phrase: string) {
    console.log("phrase", phrase);
  }
  inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
    clearTimeout(this.apiDebouncer);
    this.apiDebouncer = window.setTimeout(() => {
      this.getSynonyms(this.state.phrase);
    }, 500);
  };
  render() {
    return (
      <main>
        <form
          onSubmit={e => {
            e && e.preventDefault();
          }}
        >
          <input
            type="text"
            name="phrase"
            value={this.state.phrase}
            placeholder="Cool phrase.."
            onChange={this.inputHandler}
            onInput={this.inputHandler}
          />
        </form>
      </main>
    );
  }
}
