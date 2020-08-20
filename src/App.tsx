import React, { Component } from "react";
import "./App.scss";

const getPhraseSynonyms: any = async (phrase: string) => {
  // ^ <any> is laziness, I mean, I want it to be string[][] but TS won't let it
  console.log("phrase:", phrase);
  let url = `https://iinvq9pu20.execute-api.us-east-1.amazonaws.com/dev/synonyms?phrase=${phrase
    .split(" ")
    .join("+")}`;
  console.log("url:", url);
  return fetch(url)
    .then(r => {
      return r.json();
    })
    .then(data => {
      const { synonyms } = data;
      return synonyms;
    })
    .catch(error => {
      console.error("API error", url, error);
    });
};
// https://codereview.stackexchange.com/a/52157
const allPossiblePhrases = (
  array: string[][],
  result: any = null,
  index = 0
) => {
  if (!result) {
    result = [];
    index = 0;
    array = array.map(function(element: any) {
      return element.push ? element : [element];
    });
  }
  if (index < array.length) {
    array[index].forEach(function(element: any) {
      var a = array.slice(0);
      a.splice(index, 1, [element]);
      allPossiblePhrases(a, result, index + 1);
    });
  } else {
    result.push(array.join(" "));
  }
  return result;
};
export default class extends Component {
  apiDebouncer: number = 0;
  state = {
    phrase: "",
    loading: false,
    // prettier-ignore
    phraseSynonyms: [
      ["chill","chilly","cold","groovy","neat","peachy","good","great","nifty","dandy"],
      ["word","idiom","idiomatic expression","articulate","formulate","musical phrase","phrasal idiom","set phrase","catchphrase","words"]
    ],
    allPossiblePhrases: []
  };
  componentDidMount() {
    this.setState({
      allPossiblePhrases: allPossiblePhrases(this.state.phraseSynonyms)
    });
  }
  processAllTheThings = async (phrase: string) => {
    const phraseSynonyms = await getPhraseSynonyms(phrase);
    console.log("phraseSynonyms:", phraseSynonyms);
    this.setState({
      loading: false,
      phraseSynonyms,
      allPossiblePhrases: allPossiblePhrases(phraseSynonyms)
    });
  };
  phraseInputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const phrase = e.target.value;
    this.setState({ phrase, loading: true });
    clearTimeout(this.apiDebouncer);
    this.apiDebouncer = window.setTimeout(() => {
      this.processAllTheThings(phrase);
    }, 500);
  };
  render() {
    const { loading, allPossiblePhrases } = this.state;
    return (
      <main>
        <h1>Lexonomicon</h1>
        <p>
          Type a phrase to find alternative versions of that.. of that phrase.
        </p>
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
            onChange={this.phraseInputHandler}
            onInput={this.phraseInputHandler}
          />
        </form>
        {loading ? (
          <ul>
            <li>Loading..</li>
          </ul>
        ) : (
          <ul>
            {allPossiblePhrases &&
              allPossiblePhrases.map((phrase: string, i) => (
                <li key={i}>{phrase.replace(/^\w/, c => c.toUpperCase())}</li>
              ))}
          </ul>
        )}
      </main>
    );
  }
}
