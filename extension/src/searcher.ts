export default async function searcher(token): Promise<string | null> {
  switch (token) {
    case "foo":
      return "https://joinpromise.com/assets/media/Measure_Efficacy.svg";

    case "bar":
      return "https://payticket.io/static/images/logos/epa_logo.jpg";

    case "shipit":
      return "https://media.giphy.com/media/79qf1N4RJtc8o/giphy.gif";

    default:
      return null;
  }
}
