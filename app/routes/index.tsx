import { Link } from "remix";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix Form</h1>
      <ul>
        <li>
          <Link to="/basic-form">Basic Form Example</Link>
        </li>
        <li>
          <Link to="/multipart-form">Mult Part Form</Link>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  );
}
