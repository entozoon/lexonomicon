import React, { Component } from "react";
import "./App.scss";

const getPhraseSynonyms = async (phrase: string) => {
  console.log("phrase", phrase);
  let url = `https://iinvq9pu20.execute-api.us-east-1.amazonaws.com/dev/phraseSynonyms?phrase=${phrase
    .split(" ")
    .join("+")}`;
  fetch(url)
    .then(r => {
      return r.json();
    })
    .then(data => {
      const { phraseSynonyms } = data;
      return phraseSynonyms;
    })
    .catch(error => {
      console.error("API error", url, error);
    });
};

export default class extends Component {
  state = { phrase: "", loading: false };
  apiDebouncer: number = 0;
  inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    this.setState({ [name]: value, loading: true });
    clearTimeout(this.apiDebouncer);
    this.apiDebouncer = window.setTimeout(() => {
      getPhraseSynonyms(this.state.phrase).then(phraseSynonyms => {
        this.setState({ phraseSynonyms, loading: false });
      });
    }, 500);
  };
  render() {
    const { loading, phraseSynonyms } = this.state;
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
        {loading ? <p>Loading..</p> : <p>words</p>}
      </main>
    );
  }
}
