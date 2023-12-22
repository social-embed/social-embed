import React from "react";

import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import CodeBlock from "@theme/CodeBlock";
import Layout from "@theme/Layout";
import Playground from "@theme/Playground";
import clsx from "clsx";

import "./index.module.css";

import styles from "./styles.module.css";

const features = [
  {
    title: "▶️ Web component: Drop-in. Native players.",
    imageUrl: "img/undraw_media_player_ylg8.svg",
    description: (
      <>
        <div style={{ marginBottom: ".5rem" }}>
          <Link to={"docs/wc/"}>
            <code>{"<o-embed />"}</code> Web component
          </Link>
          :
        </div>
        <Playground className="language-html">{`<o-embed\n  url="https://youtu.be/FTQbiNvZqaY"\n  width="100%"\n></o-embed>`}</Playground>
        Try it live:{" "}
        <Link href="https://codepen.io/attachment/pen/poRRwdy">codepen.io</Link>
        , <Link href="https://jsfiddle.net/gitpull/vc13Lhkz/">jsfiddle</Link>
      </>
    ),
  },
  {
    title: "⚙️ Library only: Detect and parse embeddable URLs",
    imageUrl: "img/undraw_select_player_64ca.svg",
    description: (
      <>
        <div style={{ marginBottom: ".5rem" }}>
          <Link to={"docs/lib/"}>
            <code>{"@social-embed/lib"}</code>
          </Link>{" "}
          is a repository of embed friendly sites and typed library for scraping
          IDs and converting IDs into an embed-friendly format.
        </div>
        <CodeBlock className="language-typescript">
          {`import {
  getProviderFromUrl,
  ProviderIdFunctionMap,
  getYouTubeIdFromUrl,
  youTubeUrlRegex,
} from '@social-embed/lib';

'https://youtu.be/watch?v=Bd8_vO5zrjo'.match(youTubeUrlRegex)
// ["https://youtu.be/watch?v=Bd8_vO5zrjo","Bd8_vO5zrjo"]

getYouTubeIdFromUrl('https://youtu.be/watch?v=Bd8_vO5zrjo')
// "Bd8_vO5zrjo"
const provider = getProviderFromUrl(
  'https://youtu.be/watch?v=Bd8_vO5zrjo'
)
// YouTube
const getId = ProviderIdFunctionMap[provider]
getId("https://youtu.be/watch?v=Bd8_vO5zrjo")
// "Bd8_vO5zrjo"
`}
        </CodeBlock>
        Try it now:{" "}
        <Link href="https://codepen.io/attachment/pen/VwPPrNq">codepen.io</Link>{" "}
        (
        <Link href="https://codepen.io/attachment/pen/poRRpdp?editors=0010">
          console
        </Link>
        ), <Link href="https://jsfiddle.net/gitpull/pcLagbsm/">jsfiddle</Link>
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--6", styles.feature)}>
      {imgUrl && (
        <div
          className="text--center"
          style={{
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "1rem",
            width: "fit-content",
            margin: "0 auto 1rem auto",
          }}
        >
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`${siteConfig.title}: Embedding media players have never been so easy`}
      description="Utilities and web component for embed-friendly websites"
    >
      <header className={clsx("hero hero--primary", styles.heroBanner)}>
        <div className="container">
          <div className="hero__title">{siteConfig.title}</div>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--secondary button--lg",
                styles.heroButton,
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={`feature-${idx}`} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
